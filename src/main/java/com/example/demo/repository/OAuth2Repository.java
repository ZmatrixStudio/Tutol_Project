package com.example.demo.repository;

import com.example.demo.entity.OAuth2;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OAuth2Repository extends JpaRepository<OAuth2, Long> {

    Optional<OAuth2> findByProviderAndProviderUserId(
            String provider,
            String providerUserId
    );

    boolean existsByProviderAndProviderUserId(
            String provider,
            String providerUserId
    );
}
