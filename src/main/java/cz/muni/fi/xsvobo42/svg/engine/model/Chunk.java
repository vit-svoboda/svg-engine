package cz.muni.fi.xsvobo42.svg.engine.model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author vit
 */
public class Chunk {

    private Point topLeft;
    private List<List<Tile>> tiles;
    
    private int width;
    private int height;

    public Chunk() {
    }

    public Chunk(Point topLeft, int width, int height) {
        setTopLeft(topLeft);
        
        this.width = width;
        this.height= height;
        
        setTiles(new ArrayList<List<Tile>>(height));
        
        for(int i = 0; i< height; i++){
            tiles.add(new ArrayList<Tile>(width));
        }        
    }

    public Point getTopLeft() {
        return topLeft;
    }
    
    private void setTopLeft(Point topLeft){
        this.topLeft = topLeft;
    }
    
    public List<List<Tile>> getTiles() {
        return tiles;
    }
    
    private void setTiles(List<List<Tile>> tiles){
        this.tiles = tiles;
    }

    public void updateTiles() {
        // TODO: Replace with single query
        for (int x = 0; x < height; x++) {
            List<Tile> row = tiles.get(x);
            
            for (int y = 0; y < width; y++) {
                Tile tile = new Tile(new Point(x, y));
                tile.updateData();

                row.add(tile);
            }
        }
    }
}
