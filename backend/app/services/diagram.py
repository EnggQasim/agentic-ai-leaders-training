"""AI Diagram Generator Service using Google Gemini."""
import base64
import hashlib
import os
from typing import Optional, Dict, Any, List
from pathlib import Path
import json
import io
import google.generativeai as genai

from app.config import get_settings


# Pre-defined diagram prompts for common robotics concepts
DIAGRAM_PROMPTS = {
    "ros2-pubsub": {
        "title": "ROS2 Publisher-Subscriber Pattern",
        "prompt": "Create a clean, professional technical diagram showing ROS2 publisher-subscriber communication pattern. Show a Publisher Node on the left connected by an arrow to a Topic (represented as a channel/pipe in the middle) which connects to a Subscriber Node on the right. Label all components clearly. Use a modern tech style with blue and green colors.",
        "chapter": "module-1-ros2",
        "section": "nodes-topics"
    },
    "ros2-service": {
        "title": "ROS2 Service-Client Pattern",
        "prompt": "Create a technical diagram showing ROS2 service-client communication. Show a Client Node on the left sending a Request arrow to a Service Server on the right, with a Response arrow returning. Label both request and response. Use professional colors.",
        "chapter": "module-1-ros2",
        "section": "services-actions"
    },
    "ros2-action": {
        "title": "ROS2 Action Pattern",
        "prompt": "Create a technical diagram showing ROS2 action server communication. Show an Action Client on the left and Action Server on the right. Include three arrows: Goal (from client to server), Feedback (server to client, dashed), and Result (server to client). Label clearly.",
        "chapter": "module-1-ros2",
        "section": "services-actions"
    },
    "ros2-architecture": {
        "title": "ROS2 Architecture Stack",
        "prompt": "Create a layered architecture diagram showing ROS2 stack: Your Application (top), ROS Client Libraries (rclpy/rclcpp), ROS Core (rcl), ROS Middleware (rmw), DDS (bottom). Show layers stacked vertically with clear labels.",
        "chapter": "module-1-ros2",
        "section": "index"
    },
    "gazebo-simulation": {
        "title": "Gazebo Simulation Architecture",
        "prompt": "Create a diagram showing Gazebo simulation components: Physics Engine, Rendering Engine, Sensor Simulation, and Robot Model (URDF). Show how they connect to ROS2 through plugins. Use a clean technical style.",
        "chapter": "module-2-simulation",
        "section": "gazebo-basics"
    },
    "urdf-robot": {
        "title": "URDF Robot Description Structure",
        "prompt": "Create a diagram showing URDF robot structure: Links (rectangular boxes) connected by Joints (circles). Show a simple 3-joint robot arm with base_link, link1, link2, and end_effector. Label joint types (revolute, fixed).",
        "chapter": "module-2-simulation",
        "section": "urdf-robots"
    },
    "isaac-platform": {
        "title": "NVIDIA Isaac Platform Overview",
        "prompt": "Create a diagram showing NVIDIA Isaac platform components: Isaac Sim (simulation), Isaac ROS (ROS2 integration), and Isaac SDK. Show how they connect to GPU computing. Use NVIDIA green color theme.",
        "chapter": "module-3-nvidia-isaac",
        "section": "isaac-sim"
    },
    "vla-architecture": {
        "title": "Vision-Language-Action Architecture",
        "prompt": "Create a diagram showing VLA (Vision-Language-Action) model architecture. Show Camera Input -> Vision Encoder -> Multimodal Fusion <- Language Encoder <- Text Command. Then Fusion -> Action Decoder -> Robot Commands. Use a modern AI style.",
        "chapter": "module-4-vla",
        "section": "llm-integration"
    },
    "slam-process": {
        "title": "SLAM Process Overview",
        "prompt": "Create a flowchart showing SLAM (Simultaneous Localization and Mapping) process: Sensor Data -> Feature Extraction -> Data Association -> Map Update and Pose Estimation (connected in a loop). Show the iterative nature clearly.",
        "chapter": "module-2-simulation",
        "section": "gazebo-basics"
    },
    "robot-perception": {
        "title": "Robot Perception Pipeline",
        "prompt": "Create a diagram showing robot perception pipeline: Sensors (camera, LiDAR, IMU) -> Sensor Fusion -> Object Detection -> Scene Understanding -> Decision Making. Show data flow with arrows.",
        "chapter": "module-4-vla",
        "section": "voice-commands"
    }
}

# Pre-defined GIF/Animation prompts for workflow visualizations
GIF_PROMPTS = {
    "ros2-message-flow": {
        "title": "ROS2 Message Flow Animation",
        "steps": [
            "Step 1: Publisher node creates a message with data",
            "Step 2: Message is serialized and sent to the topic",
            "Step 3: DDS middleware routes the message",
            "Step 4: Subscriber node receives and processes the message"
        ],
        "chapter": "module-1-ros2",
        "section": "nodes-topics"
    },
    "ros2-service-call": {
        "title": "ROS2 Service Call Sequence",
        "steps": [
            "Step 1: Client creates and sends a request",
            "Step 2: Server receives the request",
            "Step 3: Server processes and generates response",
            "Step 4: Client receives the response"
        ],
        "chapter": "module-1-ros2",
        "section": "services-actions"
    },
    "gazebo-physics-loop": {
        "title": "Gazebo Physics Simulation Loop",
        "steps": [
            "Step 1: Read sensor data from world",
            "Step 2: Apply robot commands",
            "Step 3: Calculate physics (collision, forces)",
            "Step 4: Update world state and render"
        ],
        "chapter": "module-2-simulation",
        "section": "gazebo-basics"
    },
    "isaac-sim-workflow": {
        "title": "Isaac Sim Robot Training Workflow",
        "steps": [
            "Step 1: Create virtual environment",
            "Step 2: Spawn and configure robot",
            "Step 3: Run training episodes",
            "Step 4: Export trained model"
        ],
        "chapter": "module-3-nvidia-isaac",
        "section": "isaac-sim"
    },
    "vla-inference": {
        "title": "VLA Model Inference Pipeline",
        "steps": [
            "Step 1: Capture camera image and voice command",
            "Step 2: Encode vision and language features",
            "Step 3: Multimodal fusion and reasoning",
            "Step 4: Generate and execute robot action"
        ],
        "chapter": "module-4-vla",
        "section": "llm-integration"
    }
}


class DiagramService:
    """Service for generating diagrams using Google Gemini."""

    def __init__(self):
        settings = get_settings()
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel(settings.gemini_model)
        else:
            self.model = None

        # Cache directory for generated diagrams
        self.cache_dir = Path(__file__).parent.parent.parent.parent / "frontend" / "static" / "img" / "generated"
        self.cache_dir.mkdir(parents=True, exist_ok=True)

        # Cache metadata file
        self.cache_file = self.cache_dir / "cache.json"
        self.cache = self._load_cache()

    def _load_cache(self) -> Dict[str, Any]:
        """Load diagram cache metadata."""
        if self.cache_file.exists():
            with open(self.cache_file, "r") as f:
                return json.load(f)
        return {}

    def _save_cache(self):
        """Save diagram cache metadata."""
        with open(self.cache_file, "w") as f:
            json.dump(self.cache, f, indent=2)

    def _get_cache_key(self, prompt: str) -> str:
        """Generate a cache key from prompt."""
        return hashlib.md5(prompt.encode()).hexdigest()[:12]

    async def generate_diagram(
        self,
        concept: str,
        custom_prompt: Optional[str] = None,
        force_regenerate: bool = False
    ) -> Dict[str, Any]:
        """
        Generate a diagram for a concept.

        Args:
            concept: Pre-defined concept ID or custom concept name
            custom_prompt: Optional custom prompt for generation
            force_regenerate: Force regeneration even if cached

        Returns:
            Dict with diagram URL, title, and metadata
        """
        if not self.model:
            return {
                "success": False,
                "error": "Gemini API not configured",
                "url": None
            }

        # Get prompt from predefined or custom
        if concept in DIAGRAM_PROMPTS:
            diagram_info = DIAGRAM_PROMPTS[concept]
            prompt = diagram_info["prompt"]
            title = diagram_info["title"]
            chapter = diagram_info.get("chapter", "general")
            section = diagram_info.get("section", "")
        else:
            prompt = custom_prompt or f"Create a clear, professional technical diagram explaining the concept of {concept} in robotics and AI. Use modern, clean styling."
            title = f"{concept} Diagram"
            chapter = "custom"
            section = ""

        # Check cache
        cache_key = self._get_cache_key(prompt)
        if not force_regenerate and cache_key in self.cache:
            cached = self.cache[cache_key]
            return {
                "success": True,
                "url": cached["url"],
                "title": cached["title"],
                "chapter": cached.get("chapter", chapter),
                "section": cached.get("section", section),
                "cached": True
            }

        try:
            # Generate image using Gemini
            response = self.model.generate_content(
                [
                    prompt,
                    "Generate this as a clean, professional SVG or PNG diagram suitable for a technical textbook. Use a white background."
                ],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                )
            )

            # Check if response contains image
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        # Save image
                        image_data = part.inline_data.data
                        mime_type = part.inline_data.mime_type

                        ext = "png" if "png" in mime_type else "jpg"
                        filename = f"{cache_key}.{ext}"
                        filepath = self.cache_dir / chapter
                        filepath.mkdir(parents=True, exist_ok=True)
                        filepath = filepath / filename

                        with open(filepath, "wb") as f:
                            f.write(base64.b64decode(image_data) if isinstance(image_data, str) else image_data)

                        # Update cache
                        url = f"/img/generated/{chapter}/{filename}"
                        self.cache[cache_key] = {
                            "url": url,
                            "title": title,
                            "chapter": chapter,
                            "section": section,
                            "prompt": prompt[:200]
                        }
                        self._save_cache()

                        return {
                            "success": True,
                            "url": url,
                            "title": title,
                            "chapter": chapter,
                            "section": section,
                            "cached": False
                        }

            # If no image generated, return text description
            return {
                "success": False,
                "error": "No image generated - Gemini returned text only",
                "text_response": response.text if hasattr(response, 'text') else str(response),
                "url": None
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "url": None
            }

    async def generate_gif(
        self,
        workflow: str,
        custom_steps: Optional[List[str]] = None,
        force_regenerate: bool = False
    ) -> Dict[str, Any]:
        """
        Generate an animated GIF for a workflow.

        Since Gemini doesn't directly generate GIFs, we generate individual
        step images and combine them with metadata for frontend animation.

        Args:
            workflow: Pre-defined workflow ID or custom workflow name
            custom_steps: Optional list of custom steps for generation
            force_regenerate: Force regeneration even if cached

        Returns:
            Dict with GIF frames/metadata, title, and info
        """
        if not self.model:
            return {
                "success": False,
                "error": "Gemini API not configured",
                "url": None
            }

        # Get steps from predefined or custom
        if workflow in GIF_PROMPTS:
            gif_info = GIF_PROMPTS[workflow]
            steps = gif_info["steps"]
            title = gif_info["title"]
            chapter = gif_info.get("chapter", "general")
            section = gif_info.get("section", "")
        else:
            steps = custom_steps or [
                f"Step 1: Initialize {workflow}",
                f"Step 2: Process {workflow}",
                f"Step 3: Complete {workflow}"
            ]
            title = f"{workflow} Workflow"
            chapter = "custom"
            section = ""

        # Generate cache key from workflow + steps
        cache_key = self._get_cache_key(workflow + "".join(steps) + "_gif")

        # Check cache
        if not force_regenerate and cache_key in self.cache:
            cached = self.cache[cache_key]
            if cached.get("type") == "gif":
                return {
                    "success": True,
                    "frames": cached["frames"],
                    "title": cached["title"],
                    "chapter": cached.get("chapter", chapter),
                    "section": cached.get("section", section),
                    "step_count": len(cached["frames"]),
                    "cached": True
                }

        frames = []

        try:
            # Generate an image for each step
            for i, step in enumerate(steps):
                step_prompt = f"""Create a clear, professional technical diagram showing:
                {step}

                This is step {i+1} of {len(steps)} in a workflow animation.
                Highlight the current active component in green (#76b900).
                Use a white background with clean, modern styling.
                Include a step indicator showing "{i+1}/{len(steps)}" in the corner.
                """

                response = self.model.generate_content(
                    [step_prompt],
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.7,
                    )
                )

                # Check if response contains image
                if response.candidates and response.candidates[0].content.parts:
                    for part in response.candidates[0].content.parts:
                        if hasattr(part, 'inline_data') and part.inline_data:
                            image_data = part.inline_data.data
                            mime_type = part.inline_data.mime_type

                            ext = "png" if "png" in mime_type else "jpg"
                            filename = f"{cache_key}_step{i+1}.{ext}"
                            filepath = self.cache_dir / chapter / "gifs"
                            filepath.mkdir(parents=True, exist_ok=True)
                            filepath = filepath / filename

                            with open(filepath, "wb") as f:
                                data = base64.b64decode(image_data) if isinstance(image_data, str) else image_data
                                f.write(data)

                            url = f"/img/generated/{chapter}/gifs/{filename}"
                            frames.append({
                                "step": i + 1,
                                "description": step,
                                "url": url
                            })
                            break

            if frames:
                # Cache the GIF data
                self.cache[cache_key] = {
                    "type": "gif",
                    "frames": frames,
                    "title": title,
                    "chapter": chapter,
                    "section": section,
                    "workflow": workflow
                }
                self._save_cache()

                return {
                    "success": True,
                    "frames": frames,
                    "title": title,
                    "chapter": chapter,
                    "section": section,
                    "step_count": len(frames),
                    "cached": False
                }

            # Fallback: return step descriptions for CSS animation
            return {
                "success": True,
                "frames": [{"step": i+1, "description": s, "url": None} for i, s in enumerate(steps)],
                "title": title,
                "chapter": chapter,
                "section": section,
                "step_count": len(steps),
                "animation_only": True,
                "cached": False
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "frames": []
            }

    def get_predefined_diagrams(self) -> Dict[str, Dict]:
        """Get list of all predefined diagram concepts."""
        return DIAGRAM_PROMPTS

    def get_predefined_gifs(self) -> Dict[str, Dict]:
        """Get list of all predefined GIF/animation workflows."""
        return GIF_PROMPTS

    def get_cached_diagrams(self) -> Dict[str, Any]:
        """Get all cached/generated diagrams."""
        return self.cache


# Singleton instance
_diagram_service: Optional[DiagramService] = None


def get_diagram_service() -> DiagramService:
    """Get or create diagram service singleton."""
    global _diagram_service
    if _diagram_service is None:
        _diagram_service = DiagramService()
    return _diagram_service
