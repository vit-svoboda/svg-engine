/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.muni.fi.xsvobo42.svg.engine.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Chunk serialized in a way more sparing when (close to) all tiles need to be passed.
 * Used for the initial full results.
 * 
 * @author vit
 */
public class ContinuousChunk {
    private final Point topLeft;
    private final List<List<Integer>> tiles;
    
    public ContinuousChunk(ChunkProvider chunk) {
        topLeft = chunk.getTopLeft();
        tiles = new ArrayList<>();
                
        for(List<Tile> row : chunk.getTiles()) {
            List<Integer> contents = new ArrayList<>();
            
            for(Tile tile : row) {
                contents.add(tile.getContent());
            }
            
            tiles.add(contents);
        }
    }
    
    public Point getTopLeft() {
        return topLeft;
    }    
    
    public List<List<Integer>> getTiles() {
        return tiles;
    }
}
