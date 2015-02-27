package cz.muni.fi.xsvobo42.svg.engine.model;

import java.util.HashMap;
import java.util.Random;

/**
 * Representation of a single map tile.
 *
 * @author vit
 */
public class Tile {

    private static final Random RNG = new Random();
    private static final HashMap<Point, Integer> serverCache = new HashMap<>();
    
    private Point position;
    private int content;

    /**
     * Initializes the tile.
     *
     * @param position position of the tile.
     */
    public Tile(Point position) {
        setPosition(position);
        
        // Initialize the random content
        Integer data = serverCache.get(position);
        if (data == null) {
            data = RNG.nextInt(4);
        }
        setContent(data);        
    }

    /**
     * Get position of the tile.
     *
     * @return position of the tile.
     */
    public Point getPosition() {
        return position;
    }

    private void setPosition(Point position) {
        this.position = position;
    }

    /**
     * Gets the data describing what is on the tile.
     *
     * @return data describing of the tile content.
     */
    public int getContent() {
        return content;
    }

    /**
     * Sets the data describing what is on the tile.
     *
     * @param data tile content description.
     */
    private void setContent(int content) {
        this.content = content;
        serverCache.put(position, content);
    }

    public boolean updateData() {
        if(RNG.nextBoolean() && RNG.nextBoolean() && RNG.nextBoolean() && RNG.nextBoolean()) {
            setContent((getContent() + 1) % 4);
            
            return true;
        }
        
        return false;
    }
}
