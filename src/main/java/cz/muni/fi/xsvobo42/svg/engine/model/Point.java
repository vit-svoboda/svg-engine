package cz.muni.fi.xsvobo42.svg.engine.model;

/**
 *
 * @author vit
 */
public class Point {

    private int x;
    private int y;

    public Point() {

    }

    public Point(int x, int y) {
        setX(x);
        setY(y);
    }

    public int getX() {
        return x;
    }

    private void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    private void setY(int y) {
        this.y = y;
    }
}
