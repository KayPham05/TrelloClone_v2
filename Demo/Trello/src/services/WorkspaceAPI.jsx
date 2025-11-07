import axiosClient from "./axios/axiosApi";

const END_POINT = {
  WORKSPACES: "workspace",
};


export const createWorkspaceAPI = (creatorUserId, name, description) => {
  return axiosClient.post(`${END_POINT.WORKSPACES}/create`, null, {
    params: { creatorUserId, name, description },
  });
};


export const deleteWorkspaceAPI = (workspaceId, requestUserId) => {
  return axiosClient.delete(`${END_POINT.WORKSPACES}/delete`, {
    params: { workspaceId, requestUserId },
  });
};


export const updateWorkspaceAPI = (workspaceId, name, description, requesterUId) => {
  return axiosClient.put(`${END_POINT.WORKSPACES}/update`, {
    workspaceId,
    name,
    description,
    requesterUId,
  });
};


export const updateWorkspaceMemberRole = (workspaceUId, targetUserUId, newRole, requesterUId) => {
  return axiosClient.put(`${END_POINT.WORKSPACES}/${workspaceUId}/update-role`, null, {
    params: {targetUserUId, newRole, requesterUId}
  })
}

export const getAllWorkspacesAPI = (userUid) => {
  return axiosClient.get(`${END_POINT.WORKSPACES}`, {
    params: { userUid },
  });
};


export const inviteUserToWorkspaceAPI = (workspaceId, userId, requesterUId, role) => {
  return axiosClient.post(`${END_POINT.WORKSPACES}/${workspaceId}/invite`, {
    userId,
    requesterUId,
    role,
  });
};

export const removeMemberFromWorkspaceAPI = (workspaceId, userId, requesterUId) => {
  return axiosClient.delete(
    `${END_POINT.WORKSPACES}/${workspaceId}/members/${userId}`,
    { params: { requesterUId } }
  );
}
export const getWorkspaceMembersAPI = (workspaceId) => {
  return axiosClient.get(`${END_POINT.WORKSPACES}/${workspaceId}/members`);
};


export const getWorkspaceBoardsAPI = (workspaceId, userUId) => {
  return axiosClient.get(`${END_POINT.WORKSPACES}/${workspaceId}/boards`,{ params: { userUId }})
};
