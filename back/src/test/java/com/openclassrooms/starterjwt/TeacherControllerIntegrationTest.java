package com.openclassrooms.starterjwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class TeacherControllerIntegrationTest {
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    @DisplayName("FindById returns teacher when found")
    void testFindById() throws Exception {
        // Créer un enseignant de test
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Romain");
        teacher.setLastName("R");
        teacherRepository.save(teacher);

        MvcResult result = mockMvc.perform(get("/api/teacher/" + teacher.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        Teacher responseTeacher = objectMapper.readValue(responseJson, Teacher.class);

        assertEquals(teacher.getId(), responseTeacher.getId());
    }

    @Test
    @DisplayName("FindByAll returns teacher")
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testFindAll() throws Exception {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Romain");
        teacher.setLastName("R");

        teacherRepository.save(teacher);

        MvcResult result = mockMvc.perform(get("/api/teacher")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        Teacher[] teachers = objectMapper.readValue(responseJson, Teacher[].class);

        assertTrue(teachers.length > 0);
        assertEquals(teacher.getId(), teachers[0].getId());
    }
}