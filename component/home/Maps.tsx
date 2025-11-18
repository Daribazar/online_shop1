export default function Maps() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center pb-8">
          <h3 className="text-3xl font-bold mb-2">Our Location</h3>
          <p className="text-gray-600">Visit us at Max Mall, Ulaanbaatar</p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <div style={{ left: 0, width: '100%', height: 0, position: 'relative', paddingBottom: '30%' }}>
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD1VnYC6EugmolDY9RjsZ77TeXstyj0288&q=Max+Mall&center=47.9153793,106.8892636&zoom=17"
              style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', border: 0 }}
              allowFullScreen
              title="Max Mall Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
