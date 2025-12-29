import { useEffect, useState } from 'react';
import { Card, ProgressBar, Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { BASE_URL, mergeFetchOptions } from '../config/apiConfig';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const ProgressScreen = () => {
  const [loading, setLoading] = useState(false);
  const [subtopics, setSubtopics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/subtopics`,
          mergeFetchOptions({ method: 'GET' })
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSubtopics(data);
      } catch (err) {
        setError(err.message || 'Failed to load progress');
        toast.error(err.message || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const grouped = DIFFICULTIES.map((d) => {
    const items = subtopics.filter((s) => (s.difficulty || 'Medium') === d);
    const total = items.length;
    const done = items.filter((s) => s.status === 'Done').length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { difficulty: d, total, done, percent };
  });

  return (
    <>
      <h1>Progress</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className='text-danger'>{error}</div>
      ) : (
        <Row className='g-3'>
          {grouped.map((g) => (
            <Col key={g.difficulty} md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{g.difficulty}</Card.Title>
                  <Card.Text>
                    {g.done} of {g.total} completed
                  </Card.Text>
                  <ProgressBar now={g.percent} label={`${g.percent}%`} />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ProgressScreen;
