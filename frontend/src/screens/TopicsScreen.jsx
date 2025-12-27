import { useEffect, useState } from 'react';
import { Accordion, Badge, Table, Form, Button, Container } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const TopicsScreen = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [expandedTopic, setExpandedTopic] = useState(null);
  const [subtopicsMap, setSubtopicsMap] = useState({});
  const [loadingSubtopics, setLoadingSubtopics] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [creating, setCreating] = useState(false);
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/topics', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setTopics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch topics');
      toast.error(err.message || 'Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubtopics = async (topicId) => {
    setLoadingSubtopics(true);
    try {
      const res = await fetch(`/api/subtopics/${topicId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setSubtopicsMap((m) => ({ ...m, [topicId]: data }));
    } catch (err) {
      toast.error(err.message || 'Failed to fetch subtopics');
    } finally {
      setLoadingSubtopics(false);
    }
  };

  // subtopic form state per topic
  const [subtopicForm, setSubtopicForm] = useState({});

  const setSubtopicField = (topicId, field, value) => {
    setSubtopicForm((s) => ({
      ...s,
      [topicId]: {
        ...(s[topicId] || {
          name: '',
          difficulty: 'Medium',
          leetcodeLink: '',
          youtubeLink: '',
          articleLink: '',
          creating: false,
        }),
        [field]: value,
      },
    }));
  };

  const handleCreateSubtopic = async (topicId, e) => {
    e.preventDefault();
    const form = subtopicForm[topicId] || {
      name: '',
      difficulty: 'Medium',
      leetcodeLink: '',
      youtubeLink: '',
      articleLink: '',
    };
    const name = (form.name || '').trim();
    const difficulty = form.difficulty || 'Medium';
    const leetcodeLink = (form.leetcodeLink || '').trim();
    const youtubeLink = (form.youtubeLink || '').trim();
    const articleLink = (form.articleLink || '').trim();

    if (!name) {
      toast.error('Please enter a subtopic name');
      return;
    }

    setSubtopicField(topicId, 'creating', true);
    try {
      const res = await fetch('/api/subtopics', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          topic: topicId,
          difficulty,
          leetcodeLink: leetcodeLink || undefined,
          youtubeLink: youtubeLink || undefined,
          articleLink: articleLink || undefined,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create subtopic');
      }

      // clear form and refresh data
      setSubtopicField(topicId, 'name', '');
      setSubtopicField(topicId, 'leetcodeLink', '');
      setSubtopicField(topicId, 'youtubeLink', '');
      setSubtopicField(topicId, 'articleLink', '');
      await fetchSubtopics(topicId);
      await fetchTopics();
      toast.success('Subtopic created');
    } catch (err) {
      toast.error(err.message || 'Failed to create subtopic');
    } finally {
      setSubtopicField(topicId, 'creating', false);
    }
  };

  const handleToggle = async (topicId) => {
    // If already expanded, collapse
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
      return;
    }

    setExpandedTopic(topicId);
    // fetch subtopics if not already fetched
    if (!subtopicsMap[topicId]) {
      await fetchSubtopics(topicId);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) {
      toast.error('Please enter a topic name');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTopicName.trim() }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create topic');
      }

      setNewTopicName('');
      await fetchTopics();
      toast.success('Topic created');
    } catch (err) {
      toast.error(err.message || 'Failed to create topic');
    } finally {
      setCreating(false);
    }
  };

  const handleCheckboxChange = async (subtopic, checked) => {
    const newStatus = checked ? 'Done' : 'Pending';
    try {
      const res = await fetch(`/api/subtopics/${subtopic._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to update subtopic');
      }

      // refresh subtopics and topics (parent topic status may change)
      await fetchSubtopics(subtopic.topic);
      // refresh topics list
      const tRes = await fetch('/api/topics', { method: 'GET', credentials: 'include' });
      if (tRes.ok) {
        const tData = await tRes.json();
        setTopics(tData);
      }

      toast.success('Subtopic updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update subtopic');
    }
  };

  return (
    <>
      <Container className='py-4'>
        <h1 className='mb-4'>Topics</h1>
        <Form onSubmit={handleCreateTopic} className='mb-4 p-3 border rounded bg-light'>
          <Form.Group controlId='name' className='d-flex gap-2'>
            <Form.Control
              type='text'
              placeholder='New topic name'
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
            />
            <Button type='submit' disabled={creating} className='text-nowrap'>
              {creating ? 'Creating...' : 'Create Topic'}
            </Button>
          </Form.Group>
        </Form>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className='alert alert-danger' role='alert'>{error}</div>
        ) : (
          <Accordion activeKey={expandedTopic}>
            {topics.length === 0 && <p className='text-muted text-center py-4'>No topics yet. Create one to get started!</p>}
            {topics.map((topic) => (
              <Accordion.Item eventKey={topic._id} key={topic._id} className='mb-2'>
                <Accordion.Header onClick={() => handleToggle(topic._id)}>
                  <div className='d-flex justify-content-between align-items-center w-100'>
                    <div className='fw-500'>{topic.name}</div>
                    <div>
                      <Badge bg={topic.status === 'Done' ? 'success' : 'warning'} className='ms-2'>
                        {topic.status}
                      </Badge>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body className='p-4'>
                  {loadingSubtopics && !subtopicsMap[topic._id] ? (
                    <Loader />
                  ) : (
                    <>
                      <div className='mb-4'>
                        <h6 className='mb-3 text-muted'>Add Subtopic</h6>
                        <form onSubmit={(e) => handleCreateSubtopic(topic._id, e)} className='d-flex flex-column gap-3'>
                          <div className='d-flex flex-column flex-md-row gap-2'>
                            <input
                              className='form-control'
                              placeholder='Subtopic name'
                              value={(subtopicForm[topic._id] && subtopicForm[topic._id].name) || ''}
                              onChange={(e) => setSubtopicField(topic._id, 'name', e.target.value)}
                            />
                            <select
                              className='form-select'
                              style={{ minWidth: '120px' }}
                              value={(subtopicForm[topic._id] && subtopicForm[topic._id].difficulty) || 'Medium'}
                              onChange={(e) => setSubtopicField(topic._id, 'difficulty', e.target.value)}
                            >
                              <option>Easy</option>
                              <option>Medium</option>
                              <option>Hard</option>
                            </select>
                          </div>
                          <div className='d-flex flex-column flex-md-row gap-2'>
                            <input
                              className='form-control form-control-sm'
                              placeholder='LeetCode Link (optional)'
                              value={(subtopicForm[topic._id] && subtopicForm[topic._id].leetcodeLink) || ''}
                              onChange={(e) => setSubtopicField(topic._id, 'leetcodeLink', e.target.value)}
                            />
                            <input
                              className='form-control form-control-sm'
                              placeholder='YouTube Link (optional)'
                              value={(subtopicForm[topic._id] && subtopicForm[topic._id].youtubeLink) || ''}
                              onChange={(e) => setSubtopicField(topic._id, 'youtubeLink', e.target.value)}
                            />
                            <input
                              className='form-control form-control-sm'
                              placeholder='Article Link (optional)'
                              value={(subtopicForm[topic._id] && subtopicForm[topic._id].articleLink) || ''}
                              onChange={(e) => setSubtopicField(topic._id, 'articleLink', e.target.value)}
                            />
                            <button
                              className='btn btn-primary btn-sm text-nowrap'
                              type='submit'
                              disabled={(subtopicForm[topic._id] && subtopicForm[topic._id].creating)}
                            >
                              {(subtopicForm[topic._id] && subtopicForm[topic._id].creating) ? 'Adding...' : 'Add'}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className='table-responsive'>
                        <Table striped bordered hover className='mb-0'>
                          <thead className='table-light'>
                            <tr>
                              <th>Name</th>
                              <th style={{ width: '12%' }}>Difficulty</th>
                              <th style={{ width: '10%' }}>Status</th>
                              <th style={{ width: '20%' }}>Resources</th>
                              <th style={{ width: '8%', textAlign: 'center' }}>Done</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(subtopicsMap[topic._id] || []).length === 0 ? (
                              <tr>
                                <td colSpan='5' className='text-center text-muted py-3'>
                                  No subtopics yet
                                </td>
                              </tr>
                            ) : (
                              (subtopicsMap[topic._id] || []).map((s) => (
                                <tr key={s._id}>
                                  <td className='fw-500'>{s.name}</td>
                                  <td>
                                    <Badge
                                      bg={
                                        s.difficulty === 'Easy'
                                          ? 'success'
                                          : s.difficulty === 'Hard'
                                          ? 'danger'
                                          : 'warning'
                                      }
                                    >
                                      {s.difficulty || 'Medium'}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg={s.status === 'Done' ? 'success' : 'warning'}>
                                      {s.status}
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className='d-flex gap-1 flex-wrap'>
                                      {s.leetcodeLink ? (
                                        <a
                                          href={s.leetcodeLink}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          title='LeetCode'
                                          className='text-decoration-none'
                                        >
                                          <Badge bg='info'>LeetCode</Badge>
                                        </a>
                                      ) : (
                                        <span style={{ fontSize: '0.8rem', color: '#ccc' }}>—</span>
                                      )}
                                      {s.youtubeLink ? (
                                        <a
                                          href={s.youtubeLink}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          title='YouTube'
                                          className='text-decoration-none'
                                        >
                                          <Badge bg='danger'>YouTube</Badge>
                                        </a>
                                      ) : (
                                        <span style={{ fontSize: '0.8rem', color: '#ccc' }}>—</span>
                                      )}
                                      {s.articleLink ? (
                                        <a
                                          href={s.articleLink}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          title='Article'
                                          className='text-decoration-none'
                                        >
                                          <Badge bg='secondary'>Article</Badge>
                                        </a>
                                      ) : (
                                        <span style={{ fontSize: '0.8rem', color: '#ccc' }}>—</span>
                                      )}
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <input
                                      type='checkbox'
                                      aria-label={`Mark ${s.name} as done`}
                                      checked={s.status === 'Done'}
                                      onChange={(e) => handleCheckboxChange(s, e.target.checked)}
                                    />
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Container>
    </>
  );
};

export default TopicsScreen;
