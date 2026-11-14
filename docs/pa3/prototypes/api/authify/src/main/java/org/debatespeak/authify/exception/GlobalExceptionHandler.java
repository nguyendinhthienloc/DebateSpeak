package org.debatespeak.authify.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public Map<String, Object> handleValidation(ValidationException ex) {
        return Map.of(
                "code", "validation_error",
                "detail", "Invalid input",
                "errors", List.of(Map.of(
                        "field", ex.getField(),
                        "message", ex.getMessage()
                ))
        );
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handleApiException(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(Map.of(
                "code", ex.getCode(),
                "detail", ex.getMessage()
        ));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleStatusException(ResponseStatusException ex) {
        String detail = ex.getReason() != null ? ex.getReason() : "Request failed";
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("detail", detail));
    }
}