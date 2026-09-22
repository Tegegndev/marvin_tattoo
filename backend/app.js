/**
 * cPanel Phusion Passenger Startup File
 *
 * This entry point boots the compiled Express.js backend for Marvin Tattoo Studio
 * in cPanel's Node.js environment (Phusion Passenger).
 */

import app from "./dist/server.js";

// Export Express app instance for Phusion Passenger compatibility
export default app;
