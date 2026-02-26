package com.hotel.booking.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    /**
     * Extraire le username (preferred_username) du JWT
     */
    public String getUsernameFromAuth(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            // Essayer différents claims possibles
            String username = jwt.getClaimAsString("preferred_username");
            if (username == null) {
                username = jwt.getClaimAsString("sub");
            }
            if (username == null) {
                username = jwt.getClaimAsString("email");
            }
            return username;
        }
        return null;
    }

    /**
     * Extraire l'email du JWT
     */
    public String getEmailFromAuth(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaimAsString("email");
        }
        return null;
    }

    /**
     * Extraire le sub (Keycloak user ID) du JWT
     */
    public String getUserIdFromAuth(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        }
        return null;
    }
}
