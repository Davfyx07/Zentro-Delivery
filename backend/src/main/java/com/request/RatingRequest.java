package com.request;

import lombok.Data;

@Data
public class RatingRequest {
    private Long restaurantId;
    private Double rating;  // 1.0-5.0 (permite medias: 4.5, 3.5)
    private String comment;  // Opcional
}
