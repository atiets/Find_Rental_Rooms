import React from 'react';
import { useSelector } from 'react-redux';
import ListPostByStatusVisibility from '../Post/ListPostByStatusVisibility';

const ListPostPending = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const token = currentUser?.accessToken;
  const status = 'pending';
  const visibility = 'hiden'; 

  return (
    <div>
      <ListPostByStatusVisibility status={status} visibility={visibility} token={token} />
    </div>
  );
};

export default ListPostPending;