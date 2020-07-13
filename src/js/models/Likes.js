export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like); 
        
        // Persist data into local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(like => like.id === id);
        this.likes.splice(index, 1);

        // Persist data into local storage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(like => like.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    // Save likes data into local storage
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    // Read likes data from local storage
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}

