import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { Content, Link, User } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
	const { username,password  } = req.body;

	try {
		await User.create({
			username,
			password,
		});

		res.json({
			message: "sigup successful",
		});

	} catch (e: any) {
		res.status(401).json({
			message: "signup failed ",
			error: e.message,
		});
	}
});

app.post("/api/v1/signin", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username, password });

		if (user) {
			const token = jwt.sign({ id: user._id }, JWT_SECRET);
			res.json({ message: "Signin successful", token });
		} else {
			res.status(401).json({ message: "Invalid credentials" });
		}
	} catch (e: any) {
        res.json({
            message:"sign failed", 
            error: e.message
        })
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {

	const { link, type } = req.body;

    try {
		await Content.create({
			link,
			type,
			title: req.body.title,
			userId: req.userId,
			tags: [],
		});

		res.json({ message: "Content added successfully" });
	} catch (e: any) {
		console.error(e);
		res.status(500).json({ message: "Error adding content", error: e.message });
	}
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
	const userId = req.userId;
	const content = await Content.find({
		userId,
	}).populate("userId", "username");
	res.json({
		content,
	});
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
	const contentId = req.body.contentId;

	await Content.deleteMany({
		contentId,
		userId: req.userId,
	});

	res.json({
		message: "Deleted",
	});
});

app.post("/api/v1/brain/share",userMiddleware, async (req, res) => {
	const {share} = req.body;

	if (share) {
		const existingLink = await Link.findOne({
			userId: req.userId,
		});

		if (existingLink) {
			res.json({
				hash: existingLink.hash,
			});
			return;
		}

		const hash = random(5);

		await Link.create({
			userId: req.userId,
			hash: hash,
		})

		res.json({
			hash,
		})
	    
	} else {
		await Link.deleteOne({
			userId: req.userId
		});

		res.json({
			message: "Removed link"
		})
	}

});

app.get("/api/v1/brain/:shareLink",  async (req, res) => {
	const hash = req.params.shareLink;

	const link = await Link.findOne({
        hash
	});

	if (!link) {
		res.status(404).json({
			message: "not found"
		})
		return;
	}

	const content = await Content.find({
		userId: link.userId
	})

    //console.log(link);

	const user = await User.findOne({
		_id: link.userId
	})

	res.json({
		username: user?.username,
		content: content
	})
});

app.listen(3000);
