export const courseLessons = [
  // ==========================================================================
  // PHYSICS COURSE
  // ==========================================================================
  {
    id: "lesson-4",
    subject: "physics",
    title: "Lesson 4: Displacement & Distance",
    description: "Learn how to differentiate distance covered from net position change using vector math.",
    slides: [
      {
        id: "intro-4",
        type: "intro",
        title: "Lesson 4: Displacement & Distance",
        subtitle: "How do we measure change in position?",
        introText: "Every movement starts with a change of position. To track this precisely in physics, we distinguish between two fundamental concepts: how far you traveled, and where you ended up relative to where you started.",
        bullets: [
          "Differentiate between points in time and time intervals.",
          "Master Scalar Distance vs. Vector Displacement.",
          "Learn when distance equals displacement magnitude, and when they differ."
        ]
      },
      {
        id: "time-concept",
        type: "theory",
        title: "1. Position of a Moving Object at Different Times",
        concept: "The position of a moving object relative to a chosen reference point changes over time. Thus, the fundamental problem of kinematics is to determine the object's position at different points in time.",
        sections: [
          {
            subtitle: "Determining Position",
            content: "To determine the position of an object, we use a coordinate system (such as coordinate axis or Oxy plane) with an origin O representing the reference point."
          },
          {
            subtitle: "Determining Time",
            content: "To determine a point in time, we choose a reference time (origin of time) and measure the elapsed time interval from this reference point to the specific moment in question."
          },
          {
            subtitle: "Reference Frame Definition",
            content: "A Reference Frame consists of a coordinate system combined with a reference time (start of clock) and a clock for tracking time intervals."
          },
          {
            subtitle: "Point in Time vs. Time Interval",
            content: "A point in time describes a specific clock moment (e.g., starts at 13:30). A time interval describes the duration of a process (e.g., lasts for 90 minutes).",
            details: "Tip: Words like 'at' or 'starts at' typically indicate a Point in Time. Words like 'during', 'for', 'about', or 'lasts' typically indicate a Time Interval."
          }
        ],
        simulationId: "sort-game",
        instruction: "Test your understanding! Click on a phrase on the left, then click on the correct bin on the right to classify it."
      },
      {
        id: "displacement-concept",
        type: "theory",
        title: "2. Understanding Displacement",
        concept: "While Distance (s) measures the total length of the path traveled, Displacement (d) is a vector that measures the net change in position from the starting point to the ending point.",
        sections: [
          {
            subtitle: "Concept of Displacement",
            content: "Displacement is a physical quantity that indicates both the distance (magnitude) and direction of the change in an object's position."
          },
          {
            subtitle: "Properties of Displacement",
            content: "Displacement is a vector quantity, represented by the symbol \\vec{d}. Unlike distance, which is a scalar, displacement has a specific direction.",
            formula: "\\vec{d} = \\vec{x}_f - \\vec{x}_i"
          },
          {
            subtitle: "Vector Representation",
            content: "We represent displacement with an arrow starting at the initial position and pointing to the final position. Its length is proportional to the magnitude of the displacement."
          }
        ],
        simulationId: "robot-grid",
        instruction: "Observe the pathfinder robot. Watch how it walks 4 units North and then 3 units East. Compare the total path walked against the straight-line displacement vector."
      },
      {
        id: "robot-quiz",
        type: "quiz",
        title: "Concept Check: Robot Pathfinder",
        question: "An automated grid robot starts at origin O(0,0). First, it travels 4 units North. Next, it turns East and travels 3 units. What are the robot's total distance (s) and displacement magnitude (d) after this trip?",
        options: [
          { text: "s = 7 units, d = 7 units", isCorrect: false },
          { text: "s = 7 units, d = 5 units", isCorrect: true },
          { text: "s = 5 units, d = 7 units", isCorrect: false },
          { text: "s = 5 units, d = 5 units", isCorrect: false }
        ],
        explanation: "1. Distance (s): The total path walked is 4 units + 3 units = 7 units. Distance is a scalar and sums all path segments.\n2. Displacement (d): The straight line connecting (0,0) to (3,4) forms a right triangle with legs of length 4 and 3. By the Pythagorean theorem, the hypotenuse d = sqrt(4^2 + 3^2) = sqrt(16 + 9) = sqrt(25) = 5 units.",
        simulationId: "robot-grid",
        instruction: "Use the grid simulation controls on the right to walk the robot 4 units North and 3 units East, then check the calculated distance (s) and displacement (d)."
      },
      {
        id: "compare-theory",
        type: "theory",
        title: "3. Comparing Distance (s) vs. Displacement (d)",
        concept: "Distance (s) and Displacement (d) behave differently depending on whether the object changes its direction of motion. We can also combine multiple displacements using vector addition: \\vec{d} = \\vec{d}_1 + \\vec{d}_2.",
        sections: [
          {
            subtitle: "Bicycle Trip Scenario",
            content: "A student rides a bicycle from home (A) to school (B) along a straight road that is 3 km long. After school, the student rides back 1 km to a bookstore (C) located on the same straight road."
          },
          {
            subtitle: "Phase 1: Home to School (Straight Motion)",
            content: "The student travels straight from home to school without reversing direction.\n- Distance covered: s1 = 3 km.\n- Displacement magnitude: d1 = 3 km.\n- Takeaway: When moving in a straight line without changing direction, distance equals displacement magnitude (s = d)."
          },
          {
            subtitle: "Phase 2: Entire Trip (Change of Direction)",
            content: "The student rides to school, turns back, and travels to the bookstore.\n- Distance covered (total path length): s2 = AB + BC = 3 km + 1 km = 4 km.\n- Displacement magnitude (net change from initial position A to final position C): d2 = AC = AB - BC = 3 km - 1 km = 2 km (directed from A to C).\n- Takeaway: When an object changes direction, distance is always greater than displacement magnitude (s > d)."
          }
        ],
        simulationId: "bike-trip",
        instruction: "Simulate a bike ride. Click 'Phase 1' to watch the student ride 3 km to school. Then click 'Phase 2' to see the student turn back 1 km to the bookstore. Observe how s and d compare!"
      },
      {
        id: "summary-4",
        type: "summary",
        title: "Lesson 4 Complete!",
        subtitle: "Awesome! You've mastered Displacement & Distance.",
        summaryText: "Let's summarize the key takeaways of what you learned today:",
        bullets: [
          "A Reference Frame combines a coordinate system, a reference point, and clock intervals.",
          "Distance (s) is a scalar (path length), while Displacement (d) is a vector (net position change straight-line).",
          "Distance equals displacement magnitude (s = d) only if motion is straight and does not change direction. If it changes direction, s > d.",
          "Displacement vectors are combined using vector addition: d = d1 + d2."
        ]
      }
    ]
  },
  {
    id: "lesson-5",
    subject: "physics",
    title: "Lesson 5: Speed & Velocity",
    description: "Examine rate of motion. Differentiate scalar speed from vector velocity and master relative reference additions.",
    slides: [
      {
        id: "intro-5",
        type: "intro",
        title: "Lesson 5: Speed & Velocity",
        subtitle: "Mastering the physics of motion and relative reference frames",
        introText: "Everything in our universe is in motion—from the tiny electrons orbiting an atom's nucleus to the giant galaxies spinning in space. But how do we describe how fast and in what direction something moves? Let's dive in!",
        bullets: [
          "Understand the difference between Speed and Velocity.",
          "Explore distance vs. displacement vectors.",
          "Master relative motion and the Velocity Addition Formula with interactive labs."
        ]
      },
      {
        id: "speed-theory",
        type: "theory",
        title: "1. Understanding Speed",
        concept: "Speed is a scalar quantity, meaning it has magnitude (a value) but no specific direction.",
        sections: [
          {
            subtitle: "Average Speed",
            content: "Defined as the total distance traveled divided by the total time taken to travel that distance. It measures how fast an object covers ground on average, regardless of any stops or changes in direction along the way.",
            formula: "v = \\frac{s}{t} \\quad \\text{or} \\quad v = \\frac{\\Delta s}{\\Delta t}",
            details: "Where: s (or \\Delta s) is the total distance (m), t (or \\Delta t) is the time interval (s)."
          },
          {
            subtitle: "Instantaneous Speed",
            content: "The speed of an object at a specific, exact instant in time. You can observe this directly in a car by checking the speedometer, which displays your instantaneous speed.",
            details: "For example, if you brake suddenly, your speedometer drops immediately, showing your instantaneous speed at each passing split-second."
          }
        ],
        simulationId: "speed",
        instruction: "Use the slider below to drive the electric car. Watch how the distance and time accumulate, and observe the speedometer showing the instantaneous speed in real-time."
      },
      {
        id: "speed-quiz",
        type: "quiz",
        title: "Concept Check: Average Speed",
        question: "A search-and-rescue drone flies along a complex, winding path through a forest. It covers a total ground distance of 180 meters in exactly 12 seconds. What is the drone's average speed?",
        options: [
          { text: "1.8 m/s", isCorrect: false },
          { text: "15 m/s", isCorrect: true },
          { text: "2,160 m/s", isCorrect: false },
          { text: "12 m/s", isCorrect: false }
        ],
        explanation: "Average speed is calculated by dividing the total distance traveled by the time taken: v = s / t. Here, the distance s = 180 m and time t = 12 s. Thus, v = 180 / 12 = 15 m/s. The shape of the path does not affect the speed since distance is a scalar quantity!"
      },
      {
        id: "velocity-theory",
        type: "theory",
        title: "2. Understanding Velocity",
        concept: "Unlike speed, velocity is a vector quantity. It describes both how fast an object is moving AND the specific direction of its motion.",
        sections: [
          {
            subtitle: "Average Velocity",
            content: "Calculated as the ratio of displacement (change in position) to the total time interval. Displacement is the straight-line distance from start to finish.",
            formula: "v = \\frac{d}{t} \\quad \\text{or} \\quad \\vec{v} = \\frac{\\Delta \\vec{d}}{\\Delta t}",
            details: "Where: d (or \\vec{d}) is the displacement vector (starting point to ending point)."
          },
          {
            subtitle: "Characteristics of the Velocity Vector ($\\vec{v}$)",
            content: "We represent velocity as an arrow (vector) with three key properties:",
            bullets: [
              "Origin: Fixed on the moving object itself.",
              "Direction: Points in the direction of the displacement (where the object is heading).",
              "Length/Magnitude: Proportional to the speed of the velocity."
            ]
          },
          {
            subtitle: "Instantaneous Velocity",
            content: "The velocity at a specific instant. It is computed as the displacement over an extremely small time interval (as \\Delta t approaches zero).",
            formula: "v_t = \\frac{\\Delta \\vec{d}}{\\Delta t} \\quad (\\text{with } \\Delta t \\to 0)"
          }
        ],
        simulationId: "velocity",
        instruction: "Drag the runner around the circular track. Compare the distance traveled (red arc) with the displacement (blue straight vector arrow). Watch what happens when you return exactly to the starting position!"
      },
      {
        id: "velocity-quiz",
        type: "quiz",
        title: "Concept Check: Speed vs. Velocity",
        question: "A runner completes one exact full lap around a circular training track of radius 50 meters in exactly 100 seconds, ending up at the exact point they started. What are their average speed and average velocity?",
        options: [
          { text: "Speed = 3.14 m/s, Velocity = 0 m/s", isCorrect: true },
          { text: "Speed = 0 m/s, Velocity = 3.14 m/s", isCorrect: false },
          { text: "Speed = 3.14 m/s, Velocity = 3.14 m/s", isCorrect: false },
          { text: "Speed = 1.00 m/s, Velocity = 0 m/s", isCorrect: false }
        ],
        explanation: "1. Distance: The circumference of a circular track is 2 * pi * r = 2 * pi * 50 = 314 meters. Speed = distance / time = 314m / 100s = 3.14 m/s.\n2. Displacement: Because the runner starts and finishes at the exact same spot, their net change in position (displacement) is 0 meters. Velocity = displacement / time = 0m / 100s = 0 m/s! This illustrates how speed and velocity differ when motion is not in a straight line."
      },
      {
        id: "addition-theory",
        type: "theory",
        title: "3. Velocity Addition Formula",
        concept: "Motion is relative. An object's velocity depends on the reference frame from which it is observed.",
        sections: [
          {
            subtitle: "The Relative Formula",
            content: "To calculate the velocity of an object (1) relative to a stationary observer (3), we sum its velocity relative to a moving frame (2) and that frame's velocity relative to the observer:",
            formula: "\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}",
            details: "Object (1) = moving object; Frame (2) = moving reference frame; Frame (3) = stationary reference frame."
          },
          {
            subtitle: "Three Key Geometric Cases",
            content: "Depending on the alignment of vectors, we resolve the addition algebraically:",
            bullets: [
              "Same Direction: v1,3 = v1,2 + v2,3 (e.g. walking forward on a moving train).",
              "Opposite Direction: v1,3 = |v1,2 - v2,3| (e.g. walking backward on a moving train).",
              "Perpendicular: v1,3 = \\sqrt{v_{1,2}^2 + v_{2,3}^2} (e.g. crossing a river with a crosscurrent). Uses Pythagorean theorem."
            ]
          }
        ],
        simulationId: "addition",
        instruction: "Toggle the navigation modes of the boat crossing the river: Downstream (Same direction), Upstream (Opposite direction), or Crossing (Perpendicular). See how the boat's actual trajectory (combined green vector) changes!"
      },
      {
        id: "addition-quiz",
        type: "quiz",
        title: "Concept Check: Relative Motion",
        question: "A passenger motorboat crosses a river. The boat's motor propels it due North (perpendicular to the banks) at a speed of 4.0 m/s relative to the water. The river current flows due East at 3.0 m/s. What is the speed of the boat relative to an observer standing on the riverbank?",
        options: [
          { text: "7.0 m/s", isCorrect: false },
          { text: "1.0 m/s", isCorrect: false },
          { text: "5.0 m/s", isCorrect: true },
          { text: "3.5 m/s", isCorrect: false }
        ],
        explanation: "The velocity of the boat relative to the bank (v1,3) is the vector sum of the boat relative to water (v1,2 = 4 m/s North) and water relative to bank (v2,3 = 3 m/s East). Since North and East are perpendicular (90 degrees), we use the Pythagorean theorem: v1,3 = sqrt(v1,2^2 + v2,3^2) = sqrt(4^2 + 3^2) = sqrt(16 + 9) = sqrt(25) = 5.0 m/s. The boat will travel diagonally at 5.0 m/s."
      },
      {
        id: "summary",
        type: "summary",
        title: "Module Complete!",
        subtitle: "Excellent job! You've mastered Lesson 5: Speed and Velocity.",
        summaryText: "Let's summarize the key takeaways of what you learned today:",
        bullets: [
          "Speed is scalar (distance/time) while Velocity is vector (displacement/time + direction).",
          "Instantaneous values show speed/velocity at a specific moment; Average values cover the whole duration.",
          "The velocity addition formula helps solve relative speed problems depending on whether vectors are parallel, anti-parallel, or perpendicular.",
          "Vectors have a fixed origin on the object, point in the direction of motion, and their lengths represent magnitude."
        ]
      }
    ]
  }
];
