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
    private static HashMap<Point, Integer> serverCache = new HashMap<>();
    
    private Point position;
    private int content;

    public Tile() {
    }

    /**
     * Initializes the position of the tile.
     *
     * @param position position of the tile.
     */
    public Tile(Point position) {
        setPosition(position);
    }

    /**
     * Get position of the tile. TODO: how are the coordinates organized? Where
     * is 0:0?
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
     * Gets the data describing what is on the tile. TODO: Enumeration? String
     * sprite identifier?
     *
     * @return data describing of the tile content.
     */
    public int getContent() {
        Integer data = serverCache.get(position);
        if(data == null){
            data = RNG.nextInt(4);
        }
        setContent(data);
        
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
