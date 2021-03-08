import React from 'react';
import HeaderContainer from '../header/header_container';
import { Link } from 'react-router-dom';
import CommentFormContainer from '../comment_form/comment_form_container';
import CommentItem from './comment_item';

class PhotoShow extends React.Component {

    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.props.fetchPhoto()
            .then(() => {
                this.props.fetchAllUsers();
                this.props.fetchComments();
            });
    }
        

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id != this.props.match.params.id) {
            this.props.fetchPhoto()
            .then(() =>
                this.props.fetchAllUsers()
            )
            .fail(() => (
                this.props.history.push('/404')
            ))
        }
    }
    
    handleDelete(e) {
        e.preventDefault();
        this.props.deletePhoto(this.props.match.params.id)
            .then(() => (
                this.props.history.push('/feed')
            ))
    }

    handleUpdate(e) {
        e.preventDefault();
        const id = this.props.photo ? this.props.photo.id : '';
        this.props.history.push(`/photos/${id}/edit`);
    }
        
    goBack() {
        this.props.history.goBack();
    }


    render() {

        const photo = this.props.photo;
        if ((!photo) || (!this.props.user[photo.userId])) return null;
        
        let buttons = <div></div>;
        if (this.props.currentUserId === photo.userId) {
            buttons = <div className="delete-update-photo">
                <button
                type="button"
                onClick={this.handleDelete}
                className="delete-photo">
                    Delete Photo
                </button>
                <button
                type="button"
                onClick={this.handleUpdate}
                className="update-photo">
                    Update Photo
                </button>
            </div>
        }



        return (
            <div className="photo-show-page">
                <HeaderContainer />
                <div className="photo-show-body">
                    <div className="image-container">
                        <i onClick={this.goBack} className="fas fa-arrow-left"></i>
                        <img src={photo.photoUrl} alt={photo.title}/>
                    </div>
                    <div className="photo-info-container">
                        <div className="photo-info-content">
                            <div className="photo-title-desc-delete">
                                <div>
                                    <div className="photo-title-desc"></div>
                                    <h1>{photo.title}</h1>
                                    <div> A photo by&nbsp;
                                        <Link to={`/users/${photo.userId}`}> 
                                            {this.props.user[photo.userId].username}
                                        </Link>
                                    </div>
                                    <div className="photo-description">
                                        <label>Description</label>
                                        <div>{photo.description}</div>
                                    </div>
                                </div>
                                {buttons}
                            </div>
                            <div className="photo-comments">
                                <ul className="comments-list">
                                    {this.props.comments.map(comment => {
                                        return (
                                            <CommentItem key={comment.id} comment={comment}
                                            user={this.props.user[comment.userId]}
                                            deleteComment={this.props.deleteComment} />
                                        )
                                    })}
                                </ul>
                                <CommentFormContainer photoId={photo.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PhotoShow;