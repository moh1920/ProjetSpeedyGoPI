package speedy.go.speedygo.stationManagement.models;

public class GoogleDistanceMatrixResponse {
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
        private double value;

        public double getValue() {
            return value;
        }

        public void setValue(double value) {
            this.value = value;
        }
    }
}

