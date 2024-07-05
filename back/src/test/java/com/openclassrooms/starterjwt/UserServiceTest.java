package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("FindById returns user when user is found")
    void testFindById() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("testuser@test.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User foundUser = userService.findById(1L);

        assertEquals(user, foundUser);
    }

    @Test
    @DisplayName("FindById returns null when user is not found")
    void testFindById_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        User foundUser = userService.findById(1L);

        assertNull(foundUser);
    }

    @Test
    @DisplayName("Delete user by id")
    void testDeleteUser() {
        Long userId = 1L;
        doNothing().when(userRepository).deleteById(userId);

        userService.delete(userId);

        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    @DisplayName("Create user")
    void testCreateUser() {
        User user = new User();
        user.setId(10L);
        user.setEmail("test@test.com");
        user.setPassword("password");

        when(userRepository.save(user)).thenReturn(user);

        User createdUser = userRepository.save(user);

        assertEquals(user, createdUser);
    }
}
