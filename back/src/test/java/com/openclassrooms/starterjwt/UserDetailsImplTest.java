package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {
    @Test
    void testUserDetailsImpl() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testuser")
                .firstName("Test")
                .lastName("User")
                .admin(true)
                .password("password")
                .build();

        assertEquals(1L, userDetails.getId());
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("Test", userDetails.getFirstName());
        assertEquals("User", userDetails.getLastName());
        assertTrue(userDetails.getAdmin());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertTrue(userDetails.isEnabled());

        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    @Test
    void testEquals() {
        UserDetailsImpl userDetails1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl userDetails2 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl userDetails3 = UserDetailsImpl.builder().id(2L).build();

        assertEquals(userDetails1, userDetails2);
        assertNotEquals(userDetails1, userDetails3);
    }
}
