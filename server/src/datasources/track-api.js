const { RESTDataSource } = require("@apollo/datasource-rest");

class TrackAPI extends RESTDataSource {
    baseURL = "https://odyssey-lift-off-rest-api.herokuapp.com/";
    getTracksForHome() {
        return this.get('tracks');
    }

    getAuthor(authorId) {
        return this.get(`author/${authorId}`);
    }

    getTrack(trackId) {
        return this.get(`track/${trackId}`)
    }

    getTrackModules(trackId) {
        return this.get(`track/${trackId}/modules`)
    }

    incrementTrackViews(trackId) {
        return this.patch(`track/${trackId}/numberOfViews`);
    }
}
module.exports = TrackAPI;