import { CREATE_COURSE, CREATE_COURSE_CHAPTER, DELETE_COURSE, GET_ALL_COURSES, GET_MY_COURSES } from "../../ActionsTypes/CourseActionTypes"




const initialState = {
    profile: {},
    updated_: false,
    my_courses: [],
    all_courses: [],
    all_courses_updated: false,
}

const CourseReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_COURSES:
            return {
                ...state,
                all_courses: action.payload,
                all_courses_updated: true
            }
        case DELETE_COURSE:
            return {
                ...state,
                my_courses: [
                    ...state.my_courses.filter(course => course.slug != action.payload)
                ]
            }
        case GET_MY_COURSES:
            return {
                ...state,
                my_courses: action.payload,
                updated_: true
            }
        case CREATE_COURSE_CHAPTER:
            return {
                ...state,
                // my_courses: [
                //     ...state.my_courses,
                //     action.payload
                // ]
            }
        case CREATE_COURSE:
            return {
                ...state,
                my_courses: [
                    ...state.my_courses,
                    action.payload
                ]
            }

        default:
            return state
    }
}

export default CourseReducer