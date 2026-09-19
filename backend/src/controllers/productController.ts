import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { processAndSaveImage, deleteLocalImage } from '../services/imageService.js';
import { z } from 'zod';

function formatSpecsString(specsInput: any): string {
  if (!specsInput) return JSON.stringify([]);
  if (Array.isArray(specsInput)) return JSON.stringify(specsInput.map(String));
  if (typeof specsInput === 'string') {
    try {
      const parsed = JSON.parse(specsInput);
      if (Array.isArray(parsed)) return JSON.stringify(parsed.map(String));
    } catch {
      const items = specsInput
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      return JSON.stringify(items);
    }
  }
  return JSON.stringify([]);
}

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(2, 'Category is required'),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.string().default('UGX'),
  description: z.string().min(5, 'Description is required'),
  imageUrl: z.string().optional(),
  inStock: z.preprocess((val) => val === true || val === 'true', z.boolean()).default(true),
  stockCount: z.coerce.number().int().min(0).default(10),
  specs: z.any().optional().transform(formatSpecsString),
  sortOrder: z.coerce.number().int().default(0),
});

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    const parsed = products.map((p) => {
      let specs = [];
      try {
        specs = JSON.parse(p.specs);
      } catch (e) {
        specs = [];
      }
      return { ...p, specs };
    });

    res.json({ success: true, count: parsed.length, data: parsed });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    let specs = [];
    try {
      specs = JSON.parse(product.specs);
    } catch (e) {
      specs = [];
    }

    res.json({ success: true, data: { ...product, specs } });
  } catch (error) {
    console.error('getProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const validated = productSchema.parse(req.body);

    let imageUrl = validated.imageUrl || '/images/default-product.png';
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file, 'product');
    }

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        category: validated.category,
        price: validated.price,
        currency: validated.currency,
        description: validated.description,
        imageUrl,
        inStock: validated.inStock,
        stockCount: validated.stockCount,
        specs: validated.specs,
        sortOrder: validated.sortOrder,
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    console.error('createProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    let imageUrl = existing.imageUrl;
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file, 'product');
      if (existing.imageUrl) {
        deleteLocalImage(existing.imageUrl);
      }
    } else if (req.body.imageUrl !== undefined && req.body.imageUrl !== '') {
      imageUrl = req.body.imageUrl;
    }

    const {
      name,
      category,
      price,
      currency,
      description,
      inStock,
      stockCount,
      specs,
      sortOrder,
    } = req.body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (category) dataToUpdate.category = category;
    if (price !== undefined && price !== '') dataToUpdate.price = parseFloat(price);
    if (currency) dataToUpdate.currency = currency;
    if (description) dataToUpdate.description = description;
    if (imageUrl) dataToUpdate.imageUrl = imageUrl;
    if (inStock !== undefined && inStock !== '') {
      dataToUpdate.inStock = inStock === true || inStock === 'true';
    }
    if (stockCount !== undefined && stockCount !== '') {
      dataToUpdate.stockCount = parseInt(stockCount, 10);
    }
    if (specs !== undefined) {
      dataToUpdate.specs = formatSpecsString(specs);
    }
    if (sortOrder !== undefined && sortOrder !== '') {
      dataToUpdate.sortOrder = parseInt(sortOrder, 10);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    let parsedSpecs = [];
    try {
      parsedSpecs = JSON.parse(updated.specs);
    } catch {
      parsedSpecs = [];
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { ...updated, specs: parsedSpecs },
    });
  } catch (error: any) {
    console.error('updateProduct error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (existing.imageUrl && existing.imageUrl.startsWith('/uploads/')) {
      deleteLocalImage(existing.imageUrl);
    }

    // Clean up dependent order items in transaction to prevent FK constraint failures
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('deleteProduct error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
}

export async function renameProductCategory(req: Request, res: Response): Promise<void> {
  try {
    const { oldCategory, newCategory } = req.body;
    if (!oldCategory || !newCategory || !oldCategory.trim() || !newCategory.trim()) {
      res.status(400).json({ success: false, message: 'Both oldCategory and newCategory are required' });
      return;
    }

    const result = await prisma.product.updateMany({
      where: { category: oldCategory.trim() },
      data: { category: newCategory.trim() },
    });

    res.json({
      success: true,
      message: `Updated ${result.count} product(s) to category '${newCategory.trim()}'`,
      count: result.count,
    });
  } catch (error: any) {
    console.error('renameProductCategory error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to rename category',
    });
  }
}

export async function deleteProductCategory(req: Request, res: Response): Promise<void> {
  try {
    const { category, fallbackCategory } = req.body;
    if (!category || !category.trim()) {
      res.status(400).json({ success: false, message: 'Category is required' });
      return;
    }

    const fallback = (fallbackCategory && fallbackCategory.trim()) || 'Aftercare';
    const result = await prisma.product.updateMany({
      where: { category: category.trim() },
      data: { category: fallback },
    });

    res.json({
      success: true,
      message: `Reassigned ${result.count} product(s) from '${category.trim()}' to '${fallback}'`,
      count: result.count,
    });
  } catch (error: any) {
    console.error('deleteProductCategory error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category',
    });
  }
}

