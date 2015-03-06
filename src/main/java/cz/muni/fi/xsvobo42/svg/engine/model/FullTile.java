package cz.muni.fi.xsvobo42.svg.engine.model;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author vit
 */
public class FullTile extends Tile {

    private String description;
    private Map<String, Double> resources;
    
    
    public FullTile(Point position) {
        super(position);
    }
    
    
    public String getDescription() {
        return description;
    }
    
    
    public Map<String, Double> getResources() {
        
        if (resources == null) {
            return null;
        }
        
        return Collections.unmodifiableMap(resources);
    }

    
    @Override
    public boolean updateData() {
        boolean result = super.updateData();
        
        switch (getContent()) {
            case 1:
                description = "Grasses, or more technically graminoids, are monocotyledonous, usually herbaceous plants with narrow leaves growing from the base.";
                resources = new HashMap<>();
                resources.put("Food", 10.0);
                resources.put("Water", 5.0);
                break;
                
            case 2:
                description = "Sand is a naturally occurring granular material composed of finely divided rock and mineral particles.";
                resources = new HashMap<>();
                resources = new HashMap<>();
                resources.put("Oil", 3.0);
                resources.put("Minerals", 5.0);
                break;
                
            case 3:
                description = "Concrete is a composite material composed mainly of water, aggregate, and cement.";
                break;
                
            default:
                description = "Soil is the mixture of minerals, organic matter, gases, liquids, and myriad organisms that together support plant life.";
                resources = new HashMap<>();
                resources.put("Food", 7.25);
                break;
        }
        
        return result;
    }
}
