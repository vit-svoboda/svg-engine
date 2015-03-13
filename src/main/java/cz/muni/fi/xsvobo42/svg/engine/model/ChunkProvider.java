package cz.muni.fi.xsvobo42.svg.engine.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Chunk provider allows to retrieve chunks of tile content data.
 * 
 * @author vit
 */
public class ChunkProvider {
    
    private static Point previousRequest;
    private final static int VOLATILITY_LIMIT = 50;
    
    private final Point topLeft;  
    private final List<List<Tile>> tiles;
    
    private final int width;
    private final int height;

    public ChunkProvider(Point topLeft, int width, int height) {
        
        this.topLeft = topLeft;        
        this.width = width;
        this.height= height;
        
        tiles = new ArrayList<>(height);
        
        for(int i = 0; i < height; i++){
            tiles.add(new ArrayList<Tile>(width));
        }        
    }

    public Point getTopLeft() {
        return topLeft;
    }

    public List<List<Tile>> getTiles() {
        return tiles;
    }

    public Object createChunk(boolean allowPartialUpdate) {
        
        List<Tile> changedTiles = new ArrayList<>(VOLATILITY_LIMIT);
        
        boolean getFullResponse = !allowPartialUpdate || !topLeft.equals(previousRequest);
        
        previousRequest = topLeft;
        
        for (int y = 0; y < height; y++) {
            List<Tile> row = tiles.get(y);
            
            for (int x = 0; x < width; x++) {
                Tile tile = new Tile(new Point(this.topLeft.getX() + x, this.topLeft.getY() + y));
                
                if (changedTiles.size() < VOLATILITY_LIMIT) {
                    if (tile.updateData()){
                        changedTiles.add(tile);
                    }
                }

                row.add(tile);
            }
        }
        
        if (getFullResponse) {
            return new ContinuousChunk(this);
        } else {
            return new SparseChunk(changedTiles);
        }
    }
}
