package com.example.crimeinvestigation.service;

public class ClueAIService {

    // simple similarity check
    public static double calculateSimilarity(String text1, String text2) {

        text1 = text1.toLowerCase();
        text2 = text2.toLowerCase();

        String[] words1 = text1.split(" ");
        String[] words2 = text2.split(" ");

        int matchCount = 0;

        for (String w1 : words1) {
            for (String w2 : words2) {
                if (w1.equals(w2)) {
                    matchCount++;
                }
            }
        }

        return (double) matchCount / Math.max(words1.length, words2.length);
    }
}