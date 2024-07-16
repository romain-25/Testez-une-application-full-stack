package com.openclassrooms.starterjwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class SessionControllerIntegrationTest {
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @WithMockUser(username = "testuser", roles = {"USER"})
    @Test
    @DisplayName("Create a new session")
    void testCreateSession() throws Exception {

        Teacher teacher = new Teacher();
        teacher.setFirstName("Romain");
        teacher.setLastName("R");
        teacher = teacherRepository.save(teacher);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("New Session");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("New session description");
        sessionDto.setTeacher_id(teacher.getId());

        MvcResult result = mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        Session responseSession = objectMapper.readValue(responseJson, Session.class);

        assertTrue(responseSession.getId() != null);
        assertTrue(responseSession.getName().equals("New Session"));
    }
    @WithMockUser(username = "testuser", roles = {"USER"})
    @Test
    @DisplayName("Create session in SQL base and GET all session of controller")
    void testFindAllSessionsViaController() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        Session[] sessions = objectMapper.readValue(responseJson, Session[].class);

        assertFalse(sessions.length == 0);
    }



    @WithMockUser(username = "testuser", roles = {"USER"})
    @Test
    @DisplayName("Update an existing session")
    void testUpdateSession() throws Exception {
        Teacher teacher = new Teacher();
        teacher.setFirstName("Romain");
        teacher.setLastName("R");
        teacher = teacherRepository.save(teacher);

        Session session = Session.builder()
                .name("Old Session")
                .date(new Date())
                .description("Old description")
                .teacher(teacher)
                .users(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        session = sessionRepository.save(session);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Updated Session");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("Updated description");
        sessionDto.setTeacher_id(teacher.getId());

        MvcResult result = mockMvc.perform(put("/api/session/" + session.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        Session responseSession = objectMapper.readValue(responseJson, Session.class);

        assertTrue(responseSession.getName().equals("Updated Session"));
    }

    @WithMockUser(username = "testuser", roles = {"USER"})
    @Test
    @DisplayName("Participate in a session and Delete Participation")
    void testParticipateInSession() throws Exception {

        User user = new User();
        user.setEmail("testuser@test.com");
        user.setPassword("password");
        user.setFirstName("Romain");
        user.setLastName("R");
        user.setAdmin(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        User userFound = userRepository.findByEmail(user.getEmail()).get();

        Teacher teacher = new Teacher();
        teacher.setFirstName("Romain");
        teacher.setLastName("R");
        teacher = teacherRepository.save(teacher);

        Session session = Session.builder()
                .name("Session to participate")
                .date(new Date())
                .description("This session will be participated in")
                .teacher(teacher)
                .users(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        session = sessionRepository.save(session);

        mockMvc.perform(post("/api/session/" + session.getId() + "/participate/" + userFound.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        Session sessionFound = sessionRepository.findById(session.getId()).get();
        List<Long> userIds = sessionFound.getUsers().stream().map(User::getId).collect(Collectors.toList());
        assertTrue(userIds.contains(userFound.getId()));

        mockMvc.perform(delete("/api/session/" + session.getId() + "/participate/" + userFound.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        sessionFound = sessionRepository.findById(session.getId()).get();
        userIds = sessionFound.getUsers().stream().map(User::getId).collect(Collectors.toList());
        assertFalse(userIds.contains(userFound.getId()));

        userRepository.delete(userFound);

    }
    @WithMockUser(username = "testuser", roles = {"USER"})
    @Test
    @DisplayName("Delete an existing session")
    void testDeleteSession() throws Exception {
        Teacher teacher = new Teacher();
        teacher.setFirstName("Romain");
        teacher.setLastName("R");
        teacher = teacherRepository.save(teacher);

        Session session = Session.builder()
                .name("Session to delete")
                .date(new Date())
                .description("This session will be deleted")
                .teacher(teacher)
                .users(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        session = sessionRepository.save(session);

        mockMvc.perform(delete("/api/session/" + session.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertTrue(sessionRepository.findById(session.getId()).isEmpty());
    }
}