package com.family.finances.core.security;

import at.favre.lib.crypto.bcrypt.BCrypt;

public class PasswordUtil {

    private static final int BCRYPT_COST = 12;

    public static String hashPassword(String rawPassword) {
        return BCrypt.withDefaults().hashToString(BCRYPT_COST, rawPassword.toCharArray());
    }

    public static boolean verifyPassword(String rawPassword, String hashedPassword) {
        if (rawPassword == null || hashedPassword == null) {
            return false;
        }
        BCrypt.Result result = BCrypt.verifyer().verify(rawPassword.toCharArray(), hashedPassword);
        return result.verified;
    }
}