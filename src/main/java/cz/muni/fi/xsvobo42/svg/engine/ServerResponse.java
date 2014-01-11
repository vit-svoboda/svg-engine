package cz.muni.fi.xsvobo42.svg.engine;

import java.util.Random;

/**
 * Data container for server response.
 *
 */
public class ServerResponse {

    private static final int SCREEN_WIDTH = 100;
    private static final int SCREEN_HEIGHT = 100;

    private static final Random RNG = new Random();

    private final int[][] map;

    public int[][] getMap() {
        return map;
    }

    public ServerResponse() {
        map = new int[SCREEN_WIDTH][SCREEN_HEIGHT];

        // Initialize the map with random ones and zeroes.
        for (int[] row : map) {
            for (int i = 0; i < row.length; i++) {
                row[i] = RNG.nextInt(2);
            }
        }
    }
}
