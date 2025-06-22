import React from "react";
import "./Courses.css"; // Import the CSS

const courses = [
  {
    title: "100 Days of Code: Python Pro Bootcamp",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    reviews: 373851,
    duration: "56.5 hours",
    lectures: 592,
    level: "All Levels",
    price: "$74.99",
  },
  {
    title: "Full-Stack Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    reviews: 440495,
    duration: "61.5 hours",
    lectures: 374,
    level: "All Levels",
    price: "$74.99",
  },
  {
    title: "AWS Cloud Practitioner CLF-C02",
    instructor: "Stephane Maarek",
    rating: 4.7,
    reviews: 251993,
    duration: "15 hours",
    lectures: 285,
    level: "Beginner",
    price: "$89.99",
  },
  {
    title: "Complete Python Bootcamp: Zero to Hero",
    instructor: "Jose Portilla",
    rating: 4.6,
    reviews: 538295,
    duration: "22 hours",
    lectures: 156,
    level: "All Levels",
    price: "$74.99",
  },
  {
    title: "ChatGPT for Business and Productivity",
    instructor: "Mike Wheeler",
    rating: 4.5,
    reviews: 110423,
    duration: "12 hours",
    lectures: 90,
    level: "Beginner to Intermediate",
    price: "$64.99",
  },
  {
    title: "Digital Marketing Masterclass",
    instructor: "Phil Ebiner",
    rating: 4.6,
    reviews: 297531,
    duration: "34.5 hours",
    lectures: 250,
    level: "All Levels",
    price: "$79.99",
  },
];

export default function CourseShowcase() {
  return (
    <div className="course-grid">
      {courses.map((course, index) => (
        <div key={index} className="course-card">
          <h2 className="course-title">{course.title}</h2>
          <p className="course-instructor">Instructor: {course.instructor}</p>
          <div className="course-rating">
            {course.rating} ★ ({course.reviews.toLocaleString()} reviews)
          </div>
          <ul className="course-details">
            <li>Duration: {course.duration}</li>
            <li>Lectures: {course.lectures}</li>
            <li>Level: {course.level}</li>
          </ul>
          <div className="course-price">{course.price}</div>
        </div>
      ))}
    </div>
  );
}
