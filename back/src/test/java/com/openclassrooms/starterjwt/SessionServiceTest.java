package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class SessionServiceTest {
    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private SessionService sessionService;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    @DisplayName("Creating a new session")
    void CreationSession(){
        Session session = new Session();
        session.setId(1L);

        when(sessionRepository.save(session)).thenReturn(session);
        Session createdSession = sessionService.create(session);
        assertEquals(session.getId(), createdSession.getId());
    }
    @Test
    @DisplayName("Creating and deleting new session")
    void testDeleteSession(){
        Session session = new Session();
        session.setId(1L);
        sessionRepository.save(session);

        sessionService.delete(session.getId());

        Session deletedSession = sessionRepository.findById(session.getId()).orElse(null);
        assertNull(deletedSession);
    }
    @Test
    @DisplayName("Creation of a new session and user, the new user registers for the new session ")
    void testParticipationSession(){
        Long sessionId = 1L;
        Long userId = 1L;
        User user = User.builder()
                .id(userId)
                .email("fake@user.fr")
                .admin(true)
                .updatedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .firstName("le")
                .lastName("test")
                .password("pass")
                .build();

        List<User> users = new ArrayList<>();

        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Romain");
        teacher.setLastName("R");

        Session session = Session.builder()
                .id(sessionId)
                .name("Test Session")
                .date(new Date())
                .description("Session de test")
                .teacher(new Teacher())
                .users(users)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sessionRepository.save(session);
        userRepository.save(user);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        sessionService.participate(session.getId(), user.getId());

        Session updatedSession = sessionRepository.findById(session.getId()).orElse(null);
        assertTrue(updatedSession.getUsers().contains(user));
    }


}