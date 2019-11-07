import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import {getAllUsersAction} from "../store/actions/adminActions";
import UserItem from "../components/UserItem";

const AdminPage = (props) => {
  let {
    admin,
    allUsers,
    getAllUsersAction
  } = props;

  useEffect(() => {
    if (admin === null) {
      //props.history.push('/');
    }

    // Get all users
    getAllUsersAction()
      .then()
      .catch((error) => {
        if (error.message === 'INVALID_LOGIN') {
          props.history.push('/admin/login')
        }
      });
  }, []);

  return (
    <section className="users-section">
      {
        allUsers != null && allUsers.length > 0 &&
        <div>
          <h2>All Users</h2>
          <div className="user-items">
            {
              allUsers.map(userItem => {
                  return <UserItem
                    key={userItem.userId}
                    userId={userItem.userId}
                    firstName={userItem.firstName}
                    lastName={userItem.lastName}
                    email={userItem.email}
                  />
                }
              )
            }
          </div>
        </div>
      }
      {
        allUsers != null && allUsers.length === 0 &&
        <h2>No Users</h2>
      }
    </section>
  )
};

const mapStateToProps = state => {
  return {
    admin: state.admin.admin,
    allUsers: state.admin.userInfo
  }
};

export default connect(mapStateToProps, {getAllUsersAction})(AdminPage);
