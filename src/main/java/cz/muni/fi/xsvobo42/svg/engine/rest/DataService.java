package cz.muni.fi.xsvobo42.svg.engine.rest;

import cz.muni.fi.xsvobo42.svg.engine.model.ChunkProvider;
import cz.muni.fi.xsvobo42.svg.engine.model.Point;
import cz.muni.fi.xsvobo42.svg.engine.model.Tile;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

/**
 * Provides a RESTful API for the data model manipulation.
 *
 * @author vit
 */
@Path("/tiles")
public class DataService {   
    /**
     * Gets information about tile on coordinates x:y and returns it serialized
     * in JSON.
     *
     * @param x X-coordinate of desired tile.
     * @param y Y-coordinate of desired tile.
     * @return JSON serialized tile information.
     */
    @GET
    @Path("{x},{y}")
    @Produces(MediaType.APPLICATION_JSON)
    public Tile getTile(@PathParam("x") int x, @PathParam("y") int y) {
        Point position = new Point(x, y);

        Tile tile = new Tile(position);
        tile.updateData();

        return tile;
    }

    @GET
    @Path("{x},{y},{x1},{y1}")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getTiles(@PathParam("x") int x, @PathParam("y") int y, @PathParam("x1") int x1, @PathParam("y1") int y1) {
        int width = x1 - x;
        int height = y1 - y;

        if (width < 0 || height < 0) {
            throw new WebApplicationException("invalid area");
        }

        ChunkProvider provider = new ChunkProvider(new Point(x, y), width, height);
        
        return provider.createChunk();
    }
}