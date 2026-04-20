function Footer() {
  return (
    <footer
      style={{
        background: "#f8f9f7",
        marginTop: "60px",
        borderTop: "1px solid #e5e7eb",
        padding: "50px 8% 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "40px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "#1f5f43",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              D
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  color: "#1f2937",
                  fontWeight: "700",
                }}
              >
                DineInsight
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Food ordering platform
              </p>
            </div>
          </div>

          <p
            style={{
              color: "#4b5563",
              lineHeight: "1.8",
              fontSize: "15px",
              maxWidth: "420px",
              margin: 0,
            }}
          >
            DineInsight makes food ordering simple and convenient. Users can
            browse dishes, add items to cart, place orders easily, and enjoy a
            smooth experience through a clean and modern interface.
          </p>
        </div>

        <div>
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "16px",
              color: "#111827",
            }}
          >
            Company
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#4b5563",
              fontSize: "15px",
            }}
          >
            <p style={{ margin: 0 }}>Home</p>
            <p style={{ margin: 0 }}>Menu</p>
            <p style={{ margin: 0 }}>Orders</p>
            <p style={{ margin: 0 }}>Admin</p>
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "16px",
              color: "#111827",
            }}
          >
            Contact Us
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#4b5563",
              fontSize: "15px",
            }}
          >
            <p style={{ margin: 0 }}>+1 (555) 123-4567</p>
            <p style={{ margin: 0 }}>support@dineinsight.com</p>
            <p style={{ margin: 0 }}>Fullerton, California, USA</p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "30px auto 0",
          borderTop: "1px solid #d1d5db",
          paddingTop: "18px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        Copyright 2026 © DineInsight. All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer