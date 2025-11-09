package com.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret,
            "secure", true
        ));
    }

    /**
     * Upload an image to Cloudinary
     * @param file MultipartFile from form
     * @param folder Folder name in Cloudinary (e.g., "restaurants", "foods", "users")
     * @return URL of uploaded image
     * @throws IOException
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "auto"
            ));
        
        return (String) uploadResult.get("secure_url");
    }

    /**
     * Delete an image from Cloudinary using public ID
     * @param publicId Public ID of the image
     * @throws IOException
     */
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    /**
     * Extract public ID from Cloudinary URL
     * @param imageUrl Full Cloudinary URL
     * @return Public ID
     */
    public String extractPublicId(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }
        
        // URL format: https://res.cloudinary.com/dlfnteget/image/upload/v1234567890/folder/filename.jpg
        String[] parts = imageUrl.split("/upload/");
        if (parts.length < 2) {
            return null;
        }
        
        String pathAfterUpload = parts[1];
        // Remove version (v1234567890/)
        String[] pathParts = pathAfterUpload.split("/", 2);
        if (pathParts.length < 2) {
            return null;
        }
        
        // Remove file extension
        String publicIdWithExtension = pathParts[1];
        int lastDotIndex = publicIdWithExtension.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return publicIdWithExtension.substring(0, lastDotIndex);
        }
        
        return publicIdWithExtension;
    }
}
