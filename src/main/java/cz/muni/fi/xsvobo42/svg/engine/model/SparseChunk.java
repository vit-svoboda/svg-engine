/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.muni.fi.xsvobo42.svg.engine.model;

import java.util.List;

/**
 * Chunk serialized in a way more sparing when only small amount of tiles need to be passed.
 * Used for the updated difference results.
 * 
 * @author vit
 */
public class SparseChunk {
    private final List<Tile> tiles;    
    
    public SparseChunk(List<Tile> changedTiles) {
        tiles = changedTiles;
    }    
    
    public List<Tile> getTiles() {
        return tiles;
    }
}
