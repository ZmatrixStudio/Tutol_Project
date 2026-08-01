package com.tutoroo.backend.validation;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FileTypeValidator
        implements ConstraintValidator<AllowedFileType, MultipartFile> {

    private Set<String> allowedTypes;

    @Override
    public void initialize(AllowedFileType constraintAnnotation) {
        allowedTypes = new HashSet<>(Arrays.asList(constraintAnnotation.types()));
    }

    @Override
    public boolean isValid(
            MultipartFile file,
            ConstraintValidatorContext context
    ) {

        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();

        return contentType != null && allowedTypes.contains(contentType);
    }
}