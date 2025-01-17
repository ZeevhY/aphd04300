
import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay, faPlusCircle } from "@fortawesome/free-solid-svg-icons"

import DashboardBase from "../../DashboardBase"
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createChapterVideo, createCourseChapter, deleteCourseChapter, deleteCourseChapterVideo, getSingleCourse } from '../../../../redux/Actions/CourseActions/CourseActions'
import Popup from '../../../../components/Popup'
import Form, { TextInput } from '../../FormSection/Form'


const VideoCard = ({ data, onDeleteClick, deleting }) => {

    return (
        <div className='rounded-md border border-gray-200 my-2 py-1 pr-5 pl-1 flex justify-between items-center'>
            <div className='flex items-center gap-3'>
                <div
                    className='w-[80px] h-[80px] border border-gray-200 bg-center bg-cover bg-no-repeat rounded-md'
                    style={{
                        backgroundImage: `url('${data.vid_thumbnail}')`
                    }}
                ></div>
                <p className='outline-none flex-1 text-sm' placeholder='Add Video Title' >{data.title}</p>
            </div>
            {
                deleting ?
                    <span>deleting...</span>
                    :
                    <span
                        className='text-red-600 cursor-pointer'
                        onClick={() => {
                            onDeleteClick()
                        }}
                    >
                        Delete
                    </span>
            }
        </div>
    )
}


const CourseSection = ({ data, onVideoAdd, onDeleteVideo, onDeleteChapter, index }) => {
    const [dropDownActive, setDropDownActive] = React.useState(false)
    const [selected_file, setSelectedFile] = useState(undefined)
    const [uploading, setUploading] = useState(false)
    const [deleting_chpt, setDeletingChptr] = useState(undefined)
    const [deleting, setDeleting] = useState(undefined)
    const dispatch = useDispatch()

    const AddNewVideo = () => {
        if (selected_file) {
            setUploading(true)
            dispatch(
                createChapterVideo(
                    { chapter: data.slug, video: selected_file, title: selected_file.name },
                    (result) => {
                        setSelectedFile(undefined)
                        onVideoAdd && onVideoAdd(result)
                        setUploading(false)
                    },
                    () => {
                        setSelectedFile(undefined)
                        setUploading(false)
                    }
                )
            )
        }
    }

    const DeleteChapter = () => {
        setDeletingChptr(true)
        dispatch(
            deleteCourseChapter(
                { id: data.slug },
                () => {
                    onDeleteChapter && onDeleteChapter()
                    setDeletingChptr(false)
                },
                () => {
                    setDeletingChptr(false)
                }
            )
        )
    }

    const DeleteVideo = (id) => {
        setDeleting(id)
        dispatch(
            deleteCourseChapterVideo(
                { id: id },
                () => {
                    onDeleteVideo(id)
                    setDeleting(undefined)
                },
                () => {
                    setDeleting(undefined)
                }
            )
        )
    }

    useEffect(() => {
        if (selected_file) {
            AddNewVideo()
        }
    }, [selected_file])

    return (
        <div className='mt-5'>
            <div className='bg-white rounded-md border border-gray-200 px-2 text-xs text-gray-600 flex justify-between  items-center'
            >
                <div className='flex items-center justify-between w-full px-4 gap-8'>
                    <div
                        className='flex items-center gap-3 cursor-pointer'
                        onClick={() => { setDropDownActive(!dropDownActive) }}
                    >
                        <FontAwesomeIcon icon={faPlay} className={'transition-all ' + (dropDownActive ? 'rotate-90 transform' : '')} />
                        <p className='p-3 block w-full outline-none text-sm'>Chapter {index}: <strong>{data.title}</strong></p>
                    </div>
                    {
                        deleting_chpt ?
                            <>
                                <span>Deleting...</span>
                            </>
                            :
                            <span
                                className='text-red-600 cursor-pointer text-sm'
                                onClick={() => {
                                    DeleteChapter()
                                }}
                            >Delete</span>
                    }
                </div>
            </div>
            {
                dropDownActive ?
                    <div className='my-3' >
                        {
                            data.videos?.map((vid, index) => {
                                return (
                                    <VideoCard
                                        data={vid}
                                        key={index}
                                        onDeleteClick={() => { DeleteVideo(vid.slug) }}
                                        deleting={deleting && deleting == vid.slug ? true : false}
                                    />
                                )
                            })
                        }
                        <div className='flex items-center justify-end text-sm'>
                            <label
                                htmlFor={data.slug}
                                className={`flex items-center gap-2 text-white rounded py-1 px-3  ${uploading ? 'bg-gray-500 cursor-not-allowed' : 'cursor-pointer bg-indigo-900 '}`}
                            >
                                {
                                    uploading ?
                                        <p>Uploading...</p>
                                        :
                                        <>
                                            <FontAwesomeIcon icon={faPlusCircle} />
                                            Add Video
                                        </>
                                }
                            </label>
                            <input
                                disabled={uploading}
                                type={'file'}
                                id={data.slug}
                                className='hidden'
                                accept='.mp4,.MP4,.mkv,.MKV'
                                value={''}
                                onChange={(e) => {
                                    setSelectedFile(e.target.files[0])
                                }}
                            />
                        </div>
                    </div>
                    :
                    <>
                    </>
            }
        </div>
    )
}


const AddCourseContent = (props) => {
    const [title, setTitle] = useState('Discussion')
    const [course_data, setCourseData] = useState(undefined)
    const [title_popup, setTitlePopup] = useState(false)
    const params = useParams()
    const history = useHistory()
    const dispatch = useDispatch()

    const AddNewSection = () => {
        dispatch(createCourseChapter(
            { course: params.course_id, title: `${title}` },
            (result) => {
                setTitlePopup(false)
                setCourseData({
                    ...course_data,
                    chapters: [
                        ...course_data.chapters,
                        result
                    ]
                })
            },
            () => {
                setTitlePopup(false)
            }
        ))
    }


    useEffect(() => {
        if (params.course_id) {
            getSingleCourse(
                { id: params.course_id },
                (result) => {
                    setCourseData(result)
                },
                () => {
                    history.goBack()
                }
            )
        }
        else {
            history.goBack()
        }
    }, [params.course_id])

    const handleAddNewVideo = (chapter_id, data) => {
        setCourseData({
            ...course_data,
            chapters: [
                ...course_data.chapters.map(chpt => {
                    if (chpt.slug == chapter_id) {
                        return {
                            ...chpt,
                            videos: [
                                ...chpt.videos,
                                data
                            ]
                        }
                    }
                    return chpt
                })
            ]
        })
    }

    const handleDeleteVideo = (chapter_id, vid_id) => {
        setCourseData({
            ...course_data,
            chapters: [
                ...course_data?.chapters.map(chptr => {
                    if (chptr.slug == chapter_id) {
                        return {
                            ...chptr,
                            videos: [
                                ...chptr.videos.filter(vid => vid.slug != vid_id)
                            ]
                        }
                    }
                    return chptr
                })
            ]
        })

    }
    console.log(course_data)

    return (
        <DashboardBase>
            <div className='flex justify-between mb-3'>
                <div>
                    <h3 className="text-2xl font-medium ">Course</h3>
                    {course_data?.title ? <p className='text-sm'>{course_data?.title}</p> : ''}
                </div>
                <button
                    to='/dashboard/tutor/courses/add-new/'
                    onClick={() => { setTitlePopup(true) }}
                    className='bg-indigo-900 select-none text-white py-2 px-7 ml-auto block rounded-md text-lg font-bold cursor-pointer'
                >
                    Add Chapter
                    <FontAwesomeIcon className='ml-2' icon={faPlusCircle} />
                </button>
            </div>
            {
                course_data && course_data?.chapters &&
                    course_data?.chapters?.length > 0 ?
                    <div className='bg-white border-gray-200 my-10 !pt-0'>
                        {
                            course_data?.chapters?.map((chapter, index) => {
                                return (
                                    <CourseSection
                                        data={chapter}
                                        key={index}
                                        index={index + 1}
                                        onDeleteVideo={(video_id) => {
                                            handleDeleteVideo(chapter.slug, video_id)
                                        }}
                                        onVideoAdd={(data) => { handleAddNewVideo(chapter.slug, data) }}
                                        onDeleteChapter={() => {
                                            setCourseData({
                                                ...course_data,
                                                chapter: [
                                                    ...course_data.chapter.filter(itm => itm.slug != chapter.slug)
                                                ]
                                            })
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                    :
                    <>
                        <div className='my-10'>
                            <p className='text-center text-sm'>Add Chapters</p>
                        </div>
                    </>
            }
            {
                title_popup &&
                <Popup
                    heading='Add Chapter Title'
                    onclose={() => {
                        setTitlePopup(false)
                    }}
                >
                    <div>
                        <Form
                            btnText='Submit'
                            onSubmit={() => {
                                AddNewSection()
                            }}
                        >
                            <TextInput
                                className='text-start'
                                placeholder='Enter Title'
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                }}
                            />
                        </Form>
                    </div>
                </Popup>
            }
        </DashboardBase>
    )
}

export default AddCourseContent