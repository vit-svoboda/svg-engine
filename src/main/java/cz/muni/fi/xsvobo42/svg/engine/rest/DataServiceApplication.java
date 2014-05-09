package cz.muni.fi.xsvobo42.svg.engine.rest;

import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.core.Application;

/**
 * Exposes the API provided by DataService.
 *
 * @author vit
 */
public class DataServiceApplication extends Application {

    private final Set<Object> singletons = new HashSet<>();

    /**
     * Initializes RESTful API with JSON services.
    */
    public DataServiceApplication() {
        singletons.add(new DataService());
    }
    
    @Override
    public Set<Class<?>> getClasses(){
        Set<Class<?>> set = new HashSet<>();
        return set;
    }    
    
    /**
     * Get a set of root resource and provider instances containing
     * JSONServices.
     *
     * @return a set of root resource and provider instances containing
     * JSONServices instance.
     */
    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }
}
