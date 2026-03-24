package com.subtly.auth.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "members",
    indexes = [Index(name = "idx_member_email", columnList = "email", unique = true)]
)
class Member(
    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = false)
    val password: String,

    @Column(nullable = false)
    val nickname: String,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val createdAt: LocalDateTime = LocalDateTime.now(),
)
