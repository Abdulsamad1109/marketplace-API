import { Injectable } from '@nestjs/common';

import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()

export class CloudinaryService {
  async uploadFile(file: Express.Multer.File,): Promise<UploadApiResponse | UploadApiErrorResponse> {
    
    // Upload file to Cloudinary using upload_stream
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No result returned from Cloudinary'));
        resolve(result);
      });
    
      toStream(file.buffer).pipe(upload);
    });  
  }

  // Delete file by public_id
  async deleteImage(publicId: string): Promise<{ result: string }> {

    try {
      const result = await v2.uploader.destroy(publicId);
      return { result: result.result }; // returns "ok", "not found", or "error"
      
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

}