package com.tutoroo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tutoroo.backend.entity.Oauth2Account;

@Repository
public interface OauthRepostitory extends JpaRepository<Oauth2Account, Long> {
    Optional<Oauth2Account> findByProviderUserId(String providerUserId);
    
}
