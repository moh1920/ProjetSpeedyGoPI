package speedy.go.speedygo.models;

public class GoogleMapsResponse {
    private Row[] rows;

    public Row[] getRows() {
        return rows;
    }

    public void setRows(Row[] rows) {
        this.rows = rows;
    }

    public static class Row {
        private Element[] elements;

        public Element[] getElements() {
            return elements;
        }

        public void setElements(Element[] elements) {
            this.elements = elements;
        }
    }

    public static class Element {
        private Distance distance;

        public Distance getDistance() {
            return distance;
        }

        public void setDistance(Distance distance) {
            this.distance = distance;
        }
    }

    public static class Distance {
        private int value; // Distance in meters

        public int getValue() {
            return value;
        }

        public void setValue(int value) {
            this.value = value;
        }
    }
}
