import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.bindActions(UserActions);

        this.user = {};
        this.userList = [];
        this.updatable = { given_name : '', family_name: '', email: '', gender: '', picture: '', is_blocked: '', is_admin: '' };
    }

    onGetCurrentUser() {
        return this.user;
    }

    onUserReceived(user) {
        this.user = user;
    }

    onUserDeleted(deletedUser) {
        this.userList.some((user, index) => {
            if (user._id === deletedUser._id) {
                this.userList.splice(index, 1);

                return true;
            }
        });
    }

    onUserUpdated(updatedUser) {
        this.userList.some((user, index) => {
            if (user._id === updatedUser._id) {
                this.userList.splice(index, 1);
                this.userList.unshift(updatedUser);

                return true;
            }
        });
    }

    onUserListReceived(userList) {
        this.userList = userList;
    }

    onSetUpdatableUser(updatable) {
        this.updatable = updatable;
    }

}

export default alt.createStore(UserStore, 'UserStore');
