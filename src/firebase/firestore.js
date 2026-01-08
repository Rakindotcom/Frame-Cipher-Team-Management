import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';

// Collection references
const USERS_COLLECTION = 'users';
const PROJECTS_COLLECTION = 'projects';
const TASKS_COLLECTION = 'tasks';

// ============ USER OPERATIONS ============

/**
 * Create or update user document
 * @param {string} userId 
 * @param {Object} userData 
 */
export const setUser = async (userId, userData) => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await updateDoc(userRef, userData).catch(async () => {
            // If update fails (doc doesn't exist), create it
            const { setDoc } = await import('firebase/firestore');
            await setDoc(userRef, {
                ...userData,
                createdAt: serverTimestamp()
            });
        });
    } else {
        await updateDoc(userRef, userData);
    }
};

/**
 * Create new user document
 * @param {string} userId 
 * @param {Object} userData 
 */
export const createUser = async (userId, userData) => {
    const { setDoc } = await import('firebase/firestore');
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp()
    });
};

/**
 * Get user by ID
 * @param {string} userId 
 * @returns {Promise<Object|null>}
 */
export const getUser = async (userId) => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
};

/**
 * Get all users
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Subscribe to users collection
 * @param {function} callback 
 * @returns {function} unsubscribe
 */
export const subscribeToUsers = (callback) => {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(users);
    });
};

/**
 * Update user role
 * @param {string} userId 
 * @param {string} role 
 */
export const updateUserRole = async (userId, role) => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, { role });
};

/**
 * Update user name
 * @param {string} userId 
 * @param {string} name 
 */
export const updateUserName = async (userId, name) => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, { name });
};

// ============ PROJECT OPERATIONS ============

/**
 * Create new project
 * @param {Object} projectData 
 * @returns {Promise<string>} project ID
 */
export const createProject = async (projectData) => {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const docRef = await addDoc(projectsRef, {
        ...projectData,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

/**
 * Get project by ID
 * @param {string} projectId 
 * @returns {Promise<Object|null>}
 */
export const getProject = async (projectId) => {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectDoc = await getDoc(projectRef);
    if (projectDoc.exists()) {
        return { id: projectDoc.id, ...projectDoc.data() };
    }
    return null;
};

/**
 * Subscribe to all projects
 * @param {function} callback 
 * @returns {function} unsubscribe
 */
export const subscribeToProjects = (callback) => {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(projects);
    });
};

/**
 * Update project
 * @param {string} projectId 
 * @param {Object} updates 
 */
export const updateProject = async (projectId, updates) => {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, updates);
};

/**
 * Delete project and all associated tasks
 * @param {string} projectId 
 */
export const deleteProject = async (projectId) => {
    // First, delete all tasks associated with this project
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, where('projectId', '==', projectId));
    const tasksSnapshot = await getDocs(q);
    
    // Delete all tasks in parallel
    const deleteTaskPromises = tasksSnapshot.docs.map(taskDoc => 
        deleteDoc(doc(db, TASKS_COLLECTION, taskDoc.id))
    );
    await Promise.all(deleteTaskPromises);
    
    // Then delete the project
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectRef);
};

// ============ TASK OPERATIONS ============

/**
 * Create new task
 * @param {Object} taskData 
 * @returns {Promise<string>} task ID
 */
export const createTask = async (taskData) => {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const docRef = await addDoc(tasksRef, {
        ...taskData,
        comments: [],
        activity: [{
            timestamp: new Date().toISOString(),
            userId: taskData.createdBy,
            eventType: 'task_created',
            metadata: { title: taskData.title }
        }],
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

/**
 * Get task by ID
 * @param {string} taskId 
 * @returns {Promise<Object|null>}
 */
export const getTask = async (taskId) => {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const taskDoc = await getDoc(taskRef);
    if (taskDoc.exists()) {
        return { id: taskDoc.id, ...taskDoc.data() };
    }
    return null;
};

/**
 * Subscribe to tasks for a project
 * @param {string} projectId 
 * @param {function} callback 
 * @returns {function} unsubscribe
 */
export const subscribeToProjectTasks = (projectId, callback) => {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, where('projectId', '==', projectId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(tasks);
    });
};

/**
 * Subscribe to all tasks
 * @param {function} callback 
 * @returns {function} unsubscribe
 */
export const subscribeToAllTasks = (callback) => {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(tasks);
    });
};

/**
 * Subscribe to tasks assigned to a user
 * @param {string} userId 
 * @param {function} callback 
 * @returns {function} unsubscribe
 */
export const subscribeToUserTasks = (userId, callback) => {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, where('assignedTo', '==', userId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(tasks);
    });
};

/**
 * Update task
 * @param {string} taskId 
 * @param {Object} updates 
 * @param {string} userId - user making the update
 * @param {string} eventType - type of activity
 */
export const updateTask = async (taskId, updates, userId, eventType = 'task_updated') => {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);

    const activityEntry = {
        timestamp: new Date().toISOString(),
        userId,
        eventType,
        metadata: updates
    };

    await updateDoc(taskRef, {
        ...updates,
        activity: arrayUnion(activityEntry)
    });
};

/**
 * Add comment to task
 * @param {string} taskId 
 * @param {Object} comment 
 */
export const addComment = async (taskId, comment) => {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);

    const commentWithTimestamp = {
        ...comment,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
    };

    const activityEntry = {
        timestamp: new Date().toISOString(),
        userId: comment.userId,
        eventType: 'comment_added',
        metadata: { commentId: commentWithTimestamp.id }
    };

    await updateDoc(taskRef, {
        comments: arrayUnion(commentWithTimestamp),
        activity: arrayUnion(activityEntry)
    });
};

/**
 * Delete task
 * @param {string} taskId 
 */
export const deleteTask = async (taskId) => {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
};

/**
 * Subscribe to single task
 * @param {string} taskId 
 * @param {function} callback 
 * @returns {function} unsubscribe
 */
export const subscribeToTask = (taskId, callback) => {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    return onSnapshot(taskRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        } else {
            callback(null);
        }
    });
};


// ============ NOTICE OPERATIONS ============

const NOTICES_COLLECTION = 'notices';

/**
 * Create new notice
 * @param {Object} noticeData 
 * @returns {Promise<string>} notice ID
 */
export const createNotice = async (noticeData) => {
    const noticesRef = collection(db, NOTICES_COLLECTION);
    const docRef = await addDoc(noticesRef, {
        ...noticeData,
        comments: [],
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

/**
 * Subscribe to all notices
 * @param {function} callback 
 * @returns {function} unsubscribe
 */
export const subscribeToNotices = (callback) => {
    const noticesRef = collection(db, NOTICES_COLLECTION);
    const q = query(noticesRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const notices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(notices);
    });
};

/**
 * Update notice
 * @param {string} noticeId 
 * @param {Object} updates 
 */
export const updateNotice = async (noticeId, updates) => {
    const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
    await updateDoc(noticeRef, updates);
};

/**
 * Delete notice
 * @param {string} noticeId 
 */
export const deleteNotice = async (noticeId) => {
    const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
    await deleteDoc(noticeRef);
};

/**
 * Add comment to notice
 * @param {string} noticeId 
 * @param {Object} comment 
 */
export const addNoticeComment = async (noticeId, comment) => {
    const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);

    const commentWithTimestamp = {
        ...comment,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
    };

    await updateDoc(noticeRef, {
        comments: arrayUnion(commentWithTimestamp)
    });
};
