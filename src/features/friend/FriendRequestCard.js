import React from "react";
import { Avatar, Box, Card, Typography, Link, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

// import useAuth from "../../hooks/useAuth";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { getOutgoingRequests } from "./friendSlice";
import { useDispatch } from "react-redux";
// import ActionButton from "./ActionButton";

function FriendRequestCard({ profile, filterName, page }) {
    // const { user } = useAuth();
    const dispatch = useDispatch();
    // const currentUserId = user._id;
    const { _id: targetUserId, name, avatarUrl, email } = profile;

    const handleDelete = async () => {
        const token = localStorage.getItem("accessToken");
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        };
        try {
            await apiService.delete(`/friends/requests/${targetUserId}`, { headers })
            toast.success("Request Deleted")
            dispatch(getOutgoingRequests({ filterName, page }))
        } catch {

        }
    }

    return (
        <Card sx={{ display: "flex", alignItems: "center", p: 3 }}>
            <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
            <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
                <Link
                    variant="subtitle2"
                    sx={{ fontWeight: 600 }}
                    component={RouterLink}
                    to={`/user/${targetUserId}`}
                >
                    {name}
                </Link>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailRoundedIcon
                        sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }}
                    />
                    <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                        {email}
                    </Typography>
                </Box>
            </Box>
            <Button
                sx={{ fontSize: "0.6rem", }}
                size="small"
                variant="contained"
                color="error"
                onClick={handleDelete}
            >
                Delete Request
            </Button>
        </Card>
    );
}

export default FriendRequestCard;
