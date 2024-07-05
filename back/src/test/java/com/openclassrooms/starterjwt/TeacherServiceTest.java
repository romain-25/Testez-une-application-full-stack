package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class TeacherServiceTest {
    @InjectMocks
    private TeacherService teacherService;
    @Mock
    private TeacherRepository teacherRepository;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    @DisplayName("Create and findById Teacher")
        void FindByIdTeacher(){
            Teacher teacher = new Teacher();
            teacher.setId(1L);
            teacher.setFirstName("Romain");
            teacher.setLastName("R");

            teacherRepository.save(teacher);
            when(teacherRepository.findById(teacher.getId())).thenReturn(Optional.of(teacher));
            Teacher found = teacherService.findById(teacher.getId());
            assertEquals(teacher, found);
        }
    @Test
    @DisplayName("FindById returns teacher when found")
    void testFindById_TeacherFound() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Romain");
        teacher.setLastName("R");
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher foundTeacher = teacherService.findById(1L);

        assertEquals(teacher, foundTeacher);
    }

    @Test
    @DisplayName("FindById returns null when teacher not found")
    void testFindById_TeacherNotFound() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());

        Teacher foundTeacher = teacherService.findById(1L);

        assertNull(foundTeacher);
    }
}