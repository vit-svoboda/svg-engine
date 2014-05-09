package cz.muni.fi.xsvobo42.svg.engine.model;

import java.util.Random;

/**
 * Representation of a single map tile.
 *
 * @author vit
 */
public class Tile {

    private static final Random RNG = new Random();
    
    private Point position;
    private String data;

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
    public String getData() {
        return data;
    }

    /**
     * Sets the data describing what is on the tile.
     *
     * @param data tile content description.
     */
    private void setData(String data) {
        this.data = data;
    }

    public void updateData() {
        setData(Integer.toString(RNG.nextInt(2)));
    }
}
