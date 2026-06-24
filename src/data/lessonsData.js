export const courseLessons = [
  // ==========================================================================
  // PHYSICS COURSE
  // ==========================================================================
  {
    id: "lesson-1",
    subject: "physics",
    title: "Lesson 1: Displacement & Distance",
    description: "Learn how to differentiate distance covered from net position change using vector math.",
    slides: [
      {
        id: "intro-1",
        type: "intro",
        title: "Lesson 1: Displacement & Distance",
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
        instruction: "Test your understanding! Click on a phrase on the left, then click on the correct bin on the right to classify it.",
        quizzes: [
          {
            id: "time-q1",
            title: "Question 1 (Theory)",
            question: "A passenger sits on a moving train and observes another person walking along the carriage corridor. Which of the following statements is correct regarding the reference frame?",
            options: [
              { text: "The walking person is always at rest in all reference frames.", isCorrect: false },
              { text: "The walking person moves relative to the carriage but remains at rest relative to the trees along the road.", isCorrect: false },
              { text: "A reference frame includes a reference object, a coordinate system, a reference time, and a clock.", isCorrect: true },
              { text: "Choosing a different reference frame does not alter the observed state of motion of the object.", isCorrect: false }
            ],
            explanation: "A complete reference frame in physics must define both spatial reference elements (reference object, coordinate system) and temporal reference elements (origin of time, clock) to measure position and time."
          },
          {
            id: "time-q2",
            title: "Question 2 (Theory)",
            question: "When stating: 'A car is driving North at a speed of $50\\text{ km/h}$ at $8\\text{ h}$ in the morning', which element acts as the origin of time?",
            options: [
              { text: "The starting location of the car.", isCorrect: false },
              { text: "The North direction.", isCorrect: false },
              { text: "The speed of $50\\text{ km/h}$.", isCorrect: false },
              { text: "The time point chosen as the zero reference ($0\\text{ h}$) to count elapsed time.", isCorrect: true }
            ],
            explanation: "The moment '8:00 AM' is a point in time measured relative to a designated zero hour reference, which is the origin of time (typically midnight or starting time)."
          },
          {
            id: "time-q3",
            title: "Question 3 (Theory)",
            question: "Identify which of the following describes a **Time Interval** rather than a **Point in Time**.",
            options: [
              { text: "A flight is delayed for about 2 hours.", isCorrect: true },
              { text: "The physics lecture begins at 13:30.", isCorrect: false },
              { text: "Midnight on New Year's Eve (00:00).", isCorrect: false },
              { text: "The train departs the station at 07:15.", isCorrect: false }
            ],
            explanation: "A time interval represents a duration or elapsed span of time ('2 hours'). The other options specify exact clock readings, which are points in time."
          }
        ]
      },
      {
        id: "displacement-concept",
        type: "theory",
        title: "2. Understanding Displacement",
        concept: "While Distance ($s$) measures the total length of the path traveled, Displacement ($\\vec{d}$) is a vector that measures the net change in position from the starting point to the ending point.",
        sections: [
          {
            subtitle: "Concept of Displacement",
            content: "Displacement is a physical quantity that indicates both the distance (magnitude) and direction of the change in an object's position."
          },
          {
            subtitle: "Properties of Displacement",
            content: "Displacement is a vector quantity, represented by the symbol $\\vec{d}$. Unlike distance, which is a scalar, displacement has a specific direction.",
            formula: "\\vec{d} = \\vec{x}_f - \\vec{x}_i"
          },
          {
            subtitle: "Vector Representation",
            content: "We represent displacement with an arrow starting at the initial position and pointing to the final position. Its length is proportional to the magnitude of the displacement."
          }
        ],
        simulationId: "robot-grid",
        instruction: "Observe the pathfinder robot. Watch how it walks 4 units North and then 3 units East. Compare the total path walked against the straight-line displacement vector.",
        quizzes: [
          {
            id: "robot-quiz",
            title: "Concept Check: Robot Pathfinder",
            question: "An automated grid robot starts at origin $O(0,0)$. First, it travels 4 units North. Next, it turns East and travels 3 units. What are the robot's total distance ($s$) and displacement magnitude ($d$) after this trip?",
            options: [
              { text: "$s = 7\\text{ units}, d = 7\\text{ units}$", isCorrect: false },
              { text: "$s = 7\\text{ units}, d = 5\\text{ units}$", isCorrect: true },
              { text: "$s = 5\\text{ units}, d = 7\\text{ units}$", isCorrect: false },
              { text: "$s = 5\\text{ units}, d = 5\\text{ units}$", isCorrect: false }
            ],
            explanation: "1. Distance ($s$): The total path walked is $4\\text{ units} + 3\\text{ units} = 7\\text{ units}$. Distance is a scalar and sums all path segments.\n2. Displacement ($d$): The straight line connecting $O(0,0)$ to $(3,4)$ forms a right triangle with legs of length 4 and 3. By the Pythagorean theorem, the hypotenuse $d = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5\\text{ units}$."
          },
          {
            id: "disp-q2",
            title: "Question 2 (Theory)",
            question: "Under which of the following conditions does the magnitude of an object's displacement equal the total distance traveled?",
            options: [
              { text: "The object moves in a straight line and does not change direction.", isCorrect: true },
              { text: "The object moves in a circular path at a constant speed for one full lap.", isCorrect: false },
              { text: "The object moves along a straight line but reverses direction once.", isCorrect: false },
              { text: "In all types of motion, regardless of direction or path shape.", isCorrect: false }
            ],
            explanation: "Distance measures the actual path length covered. Displacement measures the straight line from start to end. They are equal only if the path is straight and there is no backtracking (no change in direction)."
          },
          {
            id: "disp-q3",
            title: "Question 3 (Theory)",
            question: "Which of the following is the standard physical symbol used to represent the displacement vector?",
            options: [
              { text: "$\\vec{d}$", isCorrect: true },
              { text: "$s$", isCorrect: false },
              { text: "$v$", isCorrect: false },
              { text: "$t$", isCorrect: false }
            ],
            explanation: "Displacement is represented as a vector $\\vec{d}$. The symbol $s$ stands for distance, $v$ for speed/velocity, and $t$ for time."
          }
        ]
      },
      {
        id: "compare-theory",
        type: "theory",
        title: "3. Comparing Distance ($s$) vs. Displacement ($\\vec{d}$)",
        concept: "Distance ($s$) and Displacement ($\\vec{d}$) behave differently depending on whether the object changes its direction of motion. We can also combine multiple displacements using vector addition: $\\vec{d} = \\vec{d}_1 + \\vec{d}_2$.",
        sections: [
          {
            subtitle: "Bicycle Trip Scenario",
            content: "A student rides a bicycle from home ($A$) to school ($B$) along a straight road that is $3\\text{ km}$ long. After school, the student rides back $1\\text{ km}$ to a bookstore ($C$) located on the same straight road."
          },
          {
            subtitle: "Phase 1: Home to School (Straight Motion)",
            content: "The student travels straight from home to school without reversing direction.\n- Distance covered: $s_1 = 3\\text{ km}$.\n- Displacement magnitude: $d_1 = 3\\text{ km}$.\n- Takeaway: When moving in a straight line without changing direction, distance equals displacement magnitude ($s = d$)."
          },
          {
            subtitle: "Phase 2: Entire Trip (Change of Direction)",
            content: "The student rides to school, turns back, and travels to the bookstore.\n- Distance covered (total path length): $s_2 = AB + BC = 3\\text{ km} + 1\\text{ km} = 4\\text{ km}$.\n- Displacement magnitude (net change from initial position $A$ to final position $C$): $d_2 = AC = AB - BC = 3\\text{ km} - 1\\text{ km} = 2\\text{ km}$ (directed from $A$ to $C$).\n- Takeaway: When an object changes direction, distance is always greater than displacement magnitude ($s > d$)."
          }
        ],
        simulationId: "bike-trip",
        instruction: "Simulate a bike ride. Click 'Phase 1' to watch the student ride $3\\text{ km}$ to school. Then click 'Phase 2' to see the student turn back $1\\text{ km}$ to the bookstore. Observe how $s$ and $d$ compare!",
        quizzes: [
          {
            id: "compare-q1",
            title: "Question 1 (Short Exercise)",
            question: "A person walks along a straight path from point A to point B for a distance of $5\\text{ km}$, then turns around and walks back $2\\text{ km}$ to point C on the same line. What are the total distance ($s$) and displacement magnitude ($d$) of the person for this entire trip?",
            options: [
              { text: "$s = 7\\text{ km}, d = 7\\text{ km}$", isCorrect: false },
              { text: "$s = 5\\text{ km}, d = 3\\text{ km}$", isCorrect: false },
              { text: "$s = 7\\text{ km}, d = 3\\text{ km}$", isCorrect: true },
              { text: "$s = 3\\text{ km}, d = 7\\text{ km}$", isCorrect: false }
            ],
            explanation: "1. Distance ($s$): Total path walked is $5\\text{ km} + 2\\text{ km} = 7\\text{ km}$.\n2. Displacement ($d$): Distance from starting point A to final point C is $5\\text{ km} - 2\\text{ km} = 3\\text{ km}$."
          },
          {
            id: "compare-q2",
            title: "Question 2 (Theory)",
            question: "If a person undergoes two consecutive displacements, $\\vec{d}_1$ and $\\vec{d}_2$, which mathematical relation describes the resultant total displacement $\\vec{d}$?",
            options: [
              { text: "$\\vec{d} = \\vec{d}_1 + \\vec{d}_2$", isCorrect: true },
              { text: "$d = d_1 + d_2$ (always algebraically)", isCorrect: false },
              { text: "$\\vec{d} = \\vec{d}_1 - \\vec{d}_2$", isCorrect: false },
              { text: "$d = \\sqrt{d_1 + d_2}$", isCorrect: false }
            ],
            explanation: "Consecutive displacements are combined using vector addition: $\\vec{d} = \\vec{d}_1 + \\vec{d}_2$. The algebraic sum $d_1 + d_2$ only holds if both displacements point in the exact same direction."
          },
          {
            id: "compare-q3",
            title: "Question 3 (Short Exercise)",
            question: "A delivery truck drives from a depot to a store $12\\text{ km}$ away, unloads, and returns to the depot. What are the truck's final distance ($s$) and displacement magnitude ($d$)?",
            options: [
              { text: "$s = 24\\text{ km}, d = 0\\text{ km}$", isCorrect: true },
              { text: "$s = 12\\text{ km}, d = 12\\text{ km}$", isCorrect: false },
              { text: "$s = 0\\text{ km}, d = 24\\text{ km}$", isCorrect: false },
              { text: "$s = 24\\text{ km}, d = 24\\text{ km}$", isCorrect: false }
            ],
            explanation: "The total distance traveled is $12\\text{ km} + 12\\text{ km} = 24\\text{ km}$. Because the truck returns to the initial starting point (depot), the net position change (displacement) is exactly $0\\text{ km}$."
          }
        ]
      },
      {
        id: "summary-1",
        type: "summary",
        title: "Lesson 1 Complete!",
        subtitle: "Awesome! You've mastered Displacement & Distance.",
        summaryText: "Let's summarize the key takeaways of what you learned today:",
        bullets: [
          "A Reference Frame combines a coordinate system, a reference point, and clock intervals.",
          "Distance ($s$) is a scalar (path length), while Displacement ($\\vec{d}$) is a vector (net position change straight-line).",
          "Distance equals displacement magnitude ($s = d$) only if motion is straight and does not change direction. If it changes direction, $s > d$.",
          "Displacement vectors are combined using vector addition: $\\vec{d} = \\vec{d}_1 + \\vec{d}_2$."
        ]
      }
    ]
  },
  {
    id: "lesson-2",
    subject: "physics",
    title: "Lesson 2: Speed & Velocity",
    description: "Examine rate of motion. Differentiate scalar speed from vector velocity and master relative reference additions.",
    slides: [
      {
        id: "intro-2",
        type: "intro",
        title: "Lesson 2: Speed & Velocity",
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
            details: "Where: $s$ (or $\\Delta s$) is the total distance ($\\text{m}$), $t$ (or $\\Delta t$) is the time interval ($\\text{s}$)."
          },
          {
            subtitle: "Instantaneous Speed",
            content: "The speed of an object at a specific, exact instant in time. You can observe this directly in a car by checking the speedometer, which displays your instantaneous speed.",
            details: "For example, if you brake suddenly, your speedometer drops immediately, showing your instantaneous speed at each passing split-second."
          }
        ],
        simulationId: "speed",
        instruction: "Use the slider below to drive the electric car. Watch how the distance and time accumulate, and observe the speedometer showing the instantaneous speed in real-time.",
        quizzes: [
          {
            id: "drone-quiz",
            title: "Concept Check: Average Speed",
            question: "A search-and-rescue drone flies along a complex, winding path through a forest. It covers a total ground distance of $180\\text{ meters}$ in exactly $12\\text{ seconds}$. What is the drone's average speed?",
            options: [
              { text: "$1.8\\text{ m/s}$", isCorrect: false },
              { text: "$15\\text{ m/s}$", isCorrect: true },
              { text: "$2{,}160\\text{ m/s}$", isCorrect: false },
              { text: "$12\\text{ m/s}$", isCorrect: false }
            ],
            explanation: "Average speed is calculated by dividing the total distance traveled by the time taken: $v = \\frac{s}{t}$. Here, the distance $s = 180\\text{ m}$ and time $t = 12\\text{ s}$. Thus, $v = 180 / 12 = 15\\text{ m/s}$. The shape of the path does not affect the speed since distance is a scalar quantity!"
          },
          {
            id: "speed-q1",
            title: "Question 1 (Theory)",
            question: "Which of the following quantities measures only the pure rate of motion without regard to its direction?",
            options: [
              { text: "Displacement", isCorrect: false },
              { text: "Average velocity", isCorrect: false },
              { text: "Average speed", isCorrect: true },
              { text: "Instantaneous velocity", isCorrect: false }
            ],
            explanation: "Speed (both average and instantaneous) is a scalar quantity that measures only the rate of motion without considering direction. Displacement and velocity are vectors which include direction."
          },
          {
            id: "speed-q2",
            title: "Question 2 (Short Exercise)",
            question: "A person rides a bicycle for a distance of $6\\text{ km}$ in $30\\text{ minutes}$. What is the average speed of that person?",
            options: [
              { text: "$3\\text{ km/h}$", isCorrect: false },
              { text: "$12\\text{ km/h}$", isCorrect: true },
              { text: "$6\\text{ km/h}$", isCorrect: false },
              { text: "$0.2\\text{ km/h}$", isCorrect: false }
            ],
            explanation: "To find average speed in $\\text{km/h}$, convert time to hours: $30\\text{ minutes} = 0.5\\text{ hours}$. Divide the distance by the time: $v = \\frac{6\\text{ km}}{0.5\\text{ h}} = 12\\text{ km/h}$."
          },
          {
            id: "speed-q3",
            title: "Question 3 (Theory)",
            question: "What information does the number displayed on a moving motorcycle's speedometer give the driver?",
            options: [
              { text: "The average speed of the entire trip", isCorrect: false },
              { text: "The average velocity of the entire trip", isCorrect: false },
              { text: "The instantaneous speed at that exact moment", isCorrect: true },
              { text: "The distance traveled", isCorrect: false }
            ],
            explanation: "A speedometer measures how fast the vehicle is traveling at that exact, specific moment in time, which is the definition of instantaneous speed."
          }
        ]
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
            details: "Where: $d$ (or $\\vec{d}$) is the displacement vector (starting point to ending point)."
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
            content: "The velocity at a specific instant. It is computed as the displacement over an extremely small time interval (as $\\Delta t$ approaches zero).",
            formula: "v_t = \\frac{\\Delta \\vec{d}}{\\Delta t} \\quad (\\text{with } \\Delta t \\to 0)"
          }
        ],
        simulationId: "velocity",
        instruction: "Drag the runner around the circular track. Compare the distance traveled (red arc) with the displacement (blue straight vector arrow). Watch what happens when you return exactly to the starting position!",
        quizzes: [
          {
            id: "runner-quiz",
            title: "Concept Check: Speed vs. Velocity",
            question: "A runner completes one exact full lap around a circular training track of radius $50\\text{ meters}$ in exactly $100\\text{ seconds}$, ending up at the exact point they started. What are their average speed and average velocity?",
            options: [
              { text: "Speed = $3.14\\text{ m/s}$, Velocity = $0\\text{ m/s}$", isCorrect: true },
              { text: "Speed = $0\\text{ m/s}$, Velocity = $3.14\\text{ m/s}$", isCorrect: false },
              { text: "Speed = $3.14\\text{ m/s}$, Velocity = $3.14\\text{ m/s}$", isCorrect: false },
              { text: "Speed = $1.00\\text{ m/s}$, Velocity = $0\\text{ m/s}$", isCorrect: false }
            ],
            explanation: "1. Distance: The circumference of a circular track is $2 \\pi r = 2 \\pi (50) \\approx 314\\text{ meters}$. Speed = $\\text{distance} / \\text{time} = 314\\text{m} / 100\\text{s} = 3.14\\text{ m/s}$.\n2. Displacement: Because the runner starts and finishes at the exact same spot, their net change in position (displacement) is $0\\text{ meters}$. Velocity = $\\text{displacement} / \\text{time} = 0\\text{m} / 100\\text{s} = 0\\text{ m/s}$! This illustrates how speed and velocity differ when motion is not in a straight line."
          },
          {
            id: "velocity-q4",
            title: "Question 4 (Theory)",
            question: "What is the biggest difference between the formula for Average Velocity and Average Speed?",
            options: [
              { text: "Velocity uses displacement, speed uses distance.", isCorrect: true },
              { text: "Velocity uses distance, speed uses displacement.", isCorrect: false },
              { text: "Velocity is divided by time, speed is multiplied by time.", isCorrect: false },
              { text: "Velocity always has a greater value than speed.", isCorrect: false }
            ],
            explanation: "Average velocity is calculated using vector displacement (net change in position), while average speed is calculated using scalar distance (total path length)."
          },
          {
            id: "velocity-q5",
            title: "Question 5 (Scenario)",
            question: "An athlete runs exactly one lap around a stadium and stops right at the starting line. What is the average velocity of the person for the entire process?",
            options: [
              { text: "Equal to the average running speed", isCorrect: false },
              { text: "Equal to $0$", isCorrect: true },
              { text: "Greater than $0$", isCorrect: false },
              { text: "Less than $0$", isCorrect: false }
            ],
            explanation: "Since the athlete finishes at the exact location they started, their net position change (displacement $d$) is $0$. Since average velocity = $\\text{displacement} / \\text{time}$, it is exactly $0$."
          },
          {
            id: "velocity-q6",
            title: "Question 6 (Theory)",
            question: "A weather report announces: \"The storm is moving at a speed of $20\\text{ km/h}$ in an East-West direction.\" What quantity is being mentioned?",
            options: [
              { text: "Instantaneous speed", isCorrect: false },
              { text: "Average speed", isCorrect: false },
              { text: "Instantaneous velocity", isCorrect: true },
              { text: "Displacement", isCorrect: false }
            ],
            explanation: "The description specifies how fast the storm is moving ($20\\text{ km/h}$) and its direction (East-West). Since it defines both magnitude and direction, it is a velocity description (specifically instantaneous velocity at this reporting time)."
          }
        ]
      },
      {
        id: "addition-theory",
        type: "theory",
        title: "3. Velocity Addition Formula",
        concept: "Motion is relative. An object's velocity depends on the reference frame from which it is observed.",
        sections: [
          {
            subtitle: "The Relative Formula",
            content: "To calculate the velocity of an object ($1$) relative to a stationary observer ($3$), we sum its velocity relative to a moving frame ($2$) and that frame's velocity relative to the observer ($3$):",
            formula: "\\vec{v}_{1,3} = \\vec{v}_{1,2} + \\vec{v}_{2,3}",
            details: "Object ($1$) = moving object; Frame ($2$) = moving reference frame; Frame ($3$) = stationary reference frame."
          },
          {
            subtitle: "Three Key Geometric Cases",
            content: "Depending on the alignment of vectors, we resolve the addition algebraically:",
            bullets: [
              "Same Direction: $v_{1,3} = v_{1,2} + v_{2,3}$ (e.g., walking forward on a moving train).",
              "Opposite Direction: $v_{1,3} = |v_{1,2} - v_{2,3}|$ (e.g., walking backward on a moving train).",
              "Perpendicular: $v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2}$ (e.g., crossing a river with a crosscurrent). Uses Pythagorean theorem."
            ]
          }
        ],
        simulationId: "addition",
        instruction: "Toggle the navigation modes of the boat crossing the river: Downstream (Same direction), Upstream (Opposite direction), or Crossing (Perpendicular). See how the boat's actual trajectory (combined green vector) changes!",
        quizzes: [
          {
            id: "boat-quiz",
            title: "Concept Check: Relative Motion",
            question: "A passenger motorboat crosses a river. The boat's motor propels it due North (perpendicular to the banks) at a speed of $4.0\\text{ m/s}$ relative to the water. The river current flows due East at $3.0\\text{ m/s}$. What is the speed of the boat relative to an observer standing on the riverbank?",
            options: [
              { text: "$7.0\\text{ m/s}$", isCorrect: false },
              { text: "$1.0\\text{ m/s}$", isCorrect: false },
              { text: "$5.0\\text{ m/s}$", isCorrect: true },
              { text: "$3.5\\text{ m/s}$", isCorrect: false }
            ],
            explanation: "The velocity of the boat relative to the bank ($v_{1,3}$) is the vector sum of the boat relative to water ($v_{1,2} = 4\\text{ m/s}$ North) and water relative to bank ($v_{2,3} = 3\\text{ m/s}$ East). Since North and East are perpendicular ($90^\\circ$), we use the Pythagorean theorem: $v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2} = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5.0\\text{ m/s}$. The boat will travel diagonally at $5.0\\text{ m/s}$."
          },
          {
            id: "addition-q7",
            title: "Question 7 (Short Exercise)",
            question: "You are standing on an escalator moving upwards with a velocity of $0.5\\text{ m/s}$. If you walk upwards in the same direction as the escalator with a velocity of $1\\text{ m/s}$ relative to the escalator, what is your velocity relative to the ground?",
            options: [
              { text: "$0.5\\text{ m/s}$", isCorrect: false },
              { text: "$1\\text{ m/s}$", isCorrect: false },
              { text: "$1.5\\text{ m/s}$", isCorrect: true },
              { text: "$0\\text{ m/s}$", isCorrect: false }
            ],
            explanation: "Since both movements are in the same direction, we add their velocities: $v_{1,3} = v_{1,2} + v_{2,3} = 1.0\\text{ m/s} + 0.5\\text{ m/s} = 1.5\\text{ m/s}$."
          },
          {
            id: "addition-q8",
            title: "Question 8 (Short Exercise)",
            question: "A canoe is traveling upstream. The velocity of the canoe relative to the water is $15\\text{ m/s}$, and the velocity of the water relative to the bank is $3\\text{ m/s}$. What velocity will a person standing on the bank see the canoe moving at?",
            options: [
              { text: "$18\\text{ m/s}$", isCorrect: false },
              { text: "$12\\text{ m/s}$", isCorrect: true },
              { text: "$15\\text{ m/s}$", isCorrect: false },
              { text: "$3\\text{ m/s}$", isCorrect: false }
            ],
            explanation: "Since the canoe is going upstream (opposite to the river current), the velocities subtract: $v_{1,3} = |v_{1,2} - v_{2,3}| = |15 - 3| = 12\\text{ m/s}$."
          },
          {
            id: "addition-q9",
            title: "Question 9 (Theory)",
            question: "If the canoe is pointed perpendicular to the current to cross the river, which of the following formulas is used to calculate the magnitude of the canoe's actual velocity relative to the bank?",
            options: [
              { text: "$v_{1,3} = v_{1,2} + v_{2,3}$", isCorrect: false },
              { text: "$v_{1,3} = |v_{1,2} - v_{2,3}|$", isCorrect: false },
              { text: "$v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2}$", isCorrect: true },
              { text: "$v_{1,3} = v_{1,2} / v_{2,3}$", isCorrect: false }
            ],
            explanation: "When vectors are perpendicular, they form a right triangle. The resulting velocity magnitude is the hypotenuse, calculated using the Pythagorean theorem: $v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2}$."
          }
        ]
      },
      {
        id: "summary-2",
        type: "summary",
        title: "Lesson 2 Complete!",
        subtitle: "Excellent job! You've mastered Lesson 2: Speed and Velocity.",
        summaryText: "Let's summarize the key takeaways of what you learned today:",
        bullets: [
          "Speed is scalar ($\\text{distance}/\\text{time}$) while Velocity is vector ($\\text{displacement}/\\text{time}$ + direction).",
          "Instantaneous values show speed/velocity at a specific moment; Average values cover the whole duration.",
          "The velocity addition formula helps solve relative speed problems depending on whether vectors are parallel, anti-parallel, or perpendicular.",
          "Vectors have a fixed origin on the object, point in the direction of motion, and their lengths represent magnitude."
        ]
      }
    ]
  },
  {
    id: "lesson-3",
    subject: "physics",
    title: "Lesson 3: Displacement-Time Graph",
    description: "Learn how to plot $d$-$t$ graphs, interpret motion intervals, and determine velocity from graph slope.",
    slides: [
      {
        id: "intro-3",
        type: "intro",
        title: "Lesson 3: Displacement-Time Graph",
        subtitle: "How can we visually represent motion?",
        introText: "A displacement-time ($d$-$t$) graph is a powerful tool in physics that visually represents an object's entire journey over time, enabling us to quickly determine its position, duration, direction, and velocity.",
        bullets: [
          "Learn how to construct a displacement-time ($d$-$t$) graph from experimental data.",
          "Interpret the shape of the graph to determine state of motion (uniform positive motion, resting, or uniform negative motion).",
          "Calculate velocity directly from the slope of the plotted path."
        ]
      },
      {
        id: "graph-plotting-theory",
        type: "theory",
        title: "1. Drawing a Displacement-Time Graph ($d$-$t$)",
        concept: "A displacement-time ($d$-$t$) graph shows how displacement $d$ varies with time $t$. Displacement $d$ is plotted on the vertical axis and time $t$ is plotted on the horizontal axis.",
        sections: [
          {
            subtitle: "Coordinate System",
            content: "Vertical Axis ($y$-axis): Represents displacement $d$ (meters, kilometers, etc.).\nHorizontal Axis ($x$-axis): Represents time $t$ (seconds, hours, etc.)."
          },
          {
            subtitle: "Plotting Procedure",
            content: "1. Identify the coordinate pairs ($t, d$) from the collected data table.\n2. Plot these coordinates as points on the coordinate plane.\n3. Connect consecutive points with straight line segments."
          },
          {
            subtitle: "Practical Example",
            content: "Consider the motion data of student A walking along a straight path:\n- Displacement $d\\text{ (m)}$: $0$, $200$, $400$, $600$, $800$, $1000$, $800$\n- Time $t\\text{ (s)}$: $0$, $50$, $100$, $150$, $200$, $250$, $300$"
          }
        ],
        simulationId: "graph-draw-sim",
        instruction: "Observe the data table above and inspect the 4 graphs in the simulator panel on the right. A correct graph must plot $d$ on the vertical axis and $t$ on the horizontal axis with accurate coordinates. Click each graph to inspect it!",
        quizzes: [
          {
            id: "graph-draw-quiz",
            title: "Concept Check: Identifying d-t Graphs",
            question: "Using Student A's motion data (displacement reaches a peak of $1000\\text{ m}$ at $t = 250\\text{ s}$, then drops to $800\\text{ m}$ at $t = 300\\text{ s}$), why is Graph B the correct representation while Graph A is incorrect?",
            options: [
              { text: "Graph A is incorrect because the vertical axis represents time $t$ and the horizontal axis represents displacement $d$ (axes are swapped).", isCorrect: true },
              { text: "Graph B is incorrect because its slope is too steep during the initial interval.", isCorrect: false },
              { text: "Graph A is correct because time $t$ should always be placed on the vertical axis for easier viewing.", isCorrect: false },
              { text: "All four graphs are correct representations of Student A's motion.", isCorrect: false }
            ],
            explanation: "The conventions for drawing a $d$-$t$ graph require: the vertical axis ($y$-axis) must represent displacement $d$, and the horizontal axis ($x$-axis) must represent time $t$. Graph A has swapped the axes, making it physically incorrect. Graph B plots the correct axes and represents the data points accurately."
          }
        ]
      },
      {
        id: "graph-motion-types",
        type: "theory",
        title: "2. Using d-t Graphs in Straight-Line Motion",
        concept: "The shape of the line on a $d$-$t$ graph allows us to quickly determine the nature and direction of an object's motion without complex calculations.",
        sections: [
          {
            subtitle: "Horizontal Line (parallel to $Ot$)",
            content: "Displacement $d$ does not change over time. Meaning: The object is stationary (at rest, $v = 0$)."
          },
          {
            subtitle: "Upward Slanting Line (positive slope)",
            content: "The object moves away from the origin in the positive direction. Meaning: The object moves in uniform straight motion in the positive direction ($v > 0$)."
          },
          {
            subtitle: "Downward Slanting Line (negative slope)",
            content: "The object moves back toward the origin. Meaning: The object moves in uniform straight motion in the negative direction ($v < 0$)."
          }
        ],
        simulationId: "robot-graph-sim",
        instruction: "Observe the 15-second journey of the toy robot on the right. Click directly on points ($A, B, C, D$) or segments ($AB, BC, CD$) on the graph to analyze the motion state, velocity, and direction.",
        quizzes: [
          {
            id: "robot-motion-quiz",
            title: "Concept Check: Robot Journey Analysis",
            question: "In the toy robot's $d$-$t$ graph: Segment $BC$ (from $5\\text{ s}$ to $10\\text{ s}$) is a horizontal line parallel to the time axis $Ot$. What is the physical state of the robot during this interval?",
            options: [
              { text: "The robot moves in uniform straight motion in the positive direction.", isCorrect: false },
              { text: "The robot is stationary (at rest), holding its position constant.", isCorrect: true },
              { text: "The robot is accelerating back toward the start.", isCorrect: false },
              { text: "The robot moves in uniform straight motion in the negative direction.", isCorrect: false }
            ],
            explanation: "A horizontal segment on a $d$-$t$ graph indicates that displacement $d$ remains constant (fixed at $10\\text{ m}$). Therefore, the robot is stationary (at rest)."
          }
        ]
      },
      {
        id: "slope-velocity-theory",
        type: "theory",
        title: "3. Determining Velocity from a d-t Graph",
        concept: "The velocity of an object is equal to the slope (slope coefficient) of the line representing its motion on a $d$-$t$ graph.",
        sections: [
          {
            subtitle: "Slope Formula",
            content: "Velocity $v = \\text{Slope} = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1}$"
          },
          {
            subtitle: "Direction & Sign of Velocity",
            content: "- Upward slope &rarr; Positive slope &rarr; $v > 0$: Object moves in the positive direction.\n- Downward slope &rarr; Negative slope &rarr; $v < 0$: Object moves in the negative direction.\n- Horizontal line &rarr; Zero slope &rarr; $v = 0$: Object is stationary."
          },
          {
            subtitle: "Slope Steepness and Speed",
            content: "The steeper the line (greater magnitude of slope), the faster the object moves (higher speed)."
          }
        ],
        simulationId: "slope-car-sim",
        instruction: "Use the slider in the simulator panel on the right to adjust the slope of the $d$-$t$ graph. Observe how the model car above moves in response to the slope (steeper: faster forward, flat: stops, negative: moves in reverse).",
        quizzes: [
          {
            id: "slope-velocity-quiz",
            title: "Concept Check: Calculating Velocity from Slope",
            question: "An object moving in a straight line has a downward-sloping $d$-$t$ graph. At $t_1 = 2\\text{ s}$, the object is at displacement $d_1 = 8\\text{ m}$. At $t_2 = 4\\text{ s}$, the object is at $d_2 = 2\\text{ m}$. What is the velocity of the object?",
            options: [
              { text: "$v = 3\\text{ m/s}$", isCorrect: false },
              { text: "$v = -3\\text{ m/s}$", isCorrect: true },
              { text: "$v = -2\\text{ m/s}$", isCorrect: false },
              { text: "$v = 1.5\\text{ m/s}$", isCorrect: false }
            ],
            explanation: "Apply the velocity slope formula: $v = \\frac{d_2 - d_1}{t_2 - t_1} = \\frac{2 - 8}{4 - 2} = \\frac{-6}{2} = -3\\text{ m/s}$. The negative sign indicates that the object is traveling in the negative direction."
          }
        ]
      },
      {
        id: "summary-3",
        type: "summary",
        title: "Lesson 3 Complete!",
        subtitle: "Great job! You have mastered displacement-time graphs.",
        summaryText: "Key takeaways to remember:",
        bullets: [
          "The vertical axis represents displacement $d$, and the horizontal axis represents time $t$.",
          "Graph line shape details: Slanting up &rarr; moving forward; Horizontal &rarr; stationary; Slanting down &rarr; moving in reverse.",
          "Velocity equals the slope of the line: $v = \\frac{\\Delta d}{\\Delta t}$. A steeper slope indicates a greater speed.",
          "A $d$-$t$ graph is a visual summary of an object's position and instantaneous velocity over time."
        ]
      }
    ]
  }
];
