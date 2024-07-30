import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { getPosts } from "./postSlice";

function PostCard({ post }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const dispatch = useDispatch();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const handleEditClick = () => {
    setAnchorEl(null);
    setIsEditing(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(post.content);
  };

  const handleEditSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await apiService.put(`/posts/${post._id}`, { content: editContent }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Post updated");
      setIsEditing(false);
      dispatch(getPosts({ userId: post.author._id })); // Refresh posts
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error("Failed to update the post");
    }
  };


  const handleDeleteConfirm = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await apiService.delete(`/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Post deleted");
      dispatch(getPosts({ userId: post.author._id })); // Refresh posts
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error("Failed to delete the post");
    }

    setOpenDialog(false);
  };
  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
          </>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleEditCancel}>Cancel</Button>
              <Button onClick={handleEditSubmit} variant="contained">
                Save
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography>{post.content}</Typography>

            {post.image && (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 300,
                  "& img": { objectFit: "cover", width: 1, height: 1 },
                }}
              >
                <img src={post.image} alt="post" />
              </Box>
            )}

            <PostReaction post={post} />
            <CommentList postId={post._id} />
            <CommentForm postId={post._id} />
          </>
        )}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>{"Are you sure you want to delete this post?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default PostCard;
