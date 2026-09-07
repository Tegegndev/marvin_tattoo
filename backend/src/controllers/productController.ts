import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { processAndSaveImage, deleteLocalImage } from '../services/imageService.js';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(2, 'Category is required'),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.string().default('UGX'),
  description: z.string().min(5, 'Description is required'),
  imageUrl: z.string().optional(),
  inStock: z.preprocess((val) => val === true || val === 'true', z.boolean()).default(true),
  stockCount: z.coerce.number().int().min(0).default(10),
  specs: z.string().default('[]'),
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

    const validated = productSchema.partial().parse(req.body);

    let imageUrl = existing.imageUrl;
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file, 'product');
      if (existing.imageUrl.startsWith('/uploads/')) {
        deleteLocalImage(existing.imageUrl);
      }
    } else if (validated.imageUrl !== undefined) {
      imageUrl = validated.imageUrl;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.category && { category: validated.category }),
        ...(validated.price !== undefined && { price: validated.price }),
        ...(validated.currency && { currency: validated.currency }),
        ...(validated.description && { description: validated.description }),
        ...(imageUrl && { imageUrl }),
        ...(validated.inStock !== undefined && { inStock: validated.inStock }),
        ...(validated.stockCount !== undefined && { stockCount: validated.stockCount }),
        ...(validated.specs !== undefined && { specs: validated.specs }),
        ...(validated.sortOrder !== undefined && { sortOrder: validated.sortOrder }),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    console.error('updateProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
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

    if (existing.imageUrl.startsWith('/uploads/')) {
      deleteLocalImage(existing.imageUrl);
    }

    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
}
